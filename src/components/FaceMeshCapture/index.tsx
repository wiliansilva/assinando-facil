import { mdiCamera, mdiCameraRetake, mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { FaceLandmarker } from '@mediapipe/tasks-vision'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button from '../Button'
import { useFaceMesh } from './hooks/useFaceMesh'
import './style.css'

type FaceMeshCameraState = 'idle' | 'streaming' | 'preview' | 'error'

export interface FaceMeshCaptureProps {
	onClose: () => void
	onConfirm: (base64: string) => void
	title: string
}

// Oval guia em coordenadas normalizadas do frame de vídeo (0–1).
// cx/cy são referenciados ao frame bruto da câmera; como o canvas é espelhado via CSS
// junto com o vídeo, a simetria no eixo X é preservada no espaço de exibição.
//
// Paisagem (web 16:9 ~1280×720): rosto ≈ 250px de largura × 350px de altura
//   rx = 125/1280 ≈ 0.10 → usar 0.12 com folga; ry = 175/720 ≈ 0.24 → usar 0.30
// Retrato (mobile 9:16 ~720×1280): o mesmo tamanho físico se mapeia de forma diferente
//   rx = 175/720 ≈ 0.24; ry = 225/1280 ≈ 0.18 → usar 0.19
type Guide = { cx: number; cy: number; rx: number; ry: number }
const GUIDE_LANDSCAPE: Guide = { cx: 0.5, cy: 0.45, rx: 0.12, ry: 0.3 }
const GUIDE_PORTRAIT: Guide = { cx: 0.5, cy: 0.42, rx: 0.32, ry: 0.28 }

function getGuide(w: number, h: number): Guide {
	return w >= h ? GUIDE_LANDSCAPE : GUIDE_PORTRAIT
}

type FaceProximity = 'too_far' | 'ok' | 'too_close'

function getFaceProximity(
	landmarks: NormalizedLandmark[],
	guide: Guide,
): FaceProximity {
	let minX = Infinity,
		maxX = -Infinity
	for (const lm of landmarks) {
		if (lm.x < minX) minX = lm.x
		if (lm.x > maxX) maxX = lm.x
	}
	const faceWidth = maxX - minX
	const guideWidth = guide.rx * 2
	if (faceWidth < guideWidth * 0.65) return 'too_far'
	if (faceWidth > guideWidth * 1.6) return 'too_close'
	return 'ok'
}

// Guinada (esquerda/direita): a ponta do nariz deve ficar próxima ao ponto médio horizontal das têmporas.
// Inclinação (cima/baixo): a ponta do nariz deve estar entre 40%–75% da distância testa-queixo.
function isFaceFrontal(landmarks: NormalizedLandmark[]): boolean {
	const noseTip = landmarks[4]
	const leftTemple = landmarks[234]
	const rightTemple = landmarks[454]
	const forehead = landmarks[10]
	const chin = landmarks[152]
	if (!noseTip || !leftTemple || !rightTemple || !forehead || !chin)
		return true

	// Verificação de guinada
	const templeSpan = Math.abs(rightTemple.x - leftTemple.x)
	if (templeSpan < 0.01) return false
	const midX = (leftTemple.x + rightTemple.x) / 2
	if (Math.abs(noseTip.x - midX) / templeSpan >= 0.15) return false

	// Verificação de inclinação
	const faceHeight = chin.y - forehead.y
	if (faceHeight < 0.01) return false
	const noseRatio = (noseTip.y - forehead.y) / faceHeight
	return noseRatio > 0.4 && noseRatio < 0.75
}

// Razão de aspecto do olho (EAR): abertura vertical / largura horizontal do olho.
// Olho esquerdo: externo=33, topo=159, base=145, interno=133
// Olho direito:  externo=263, topo=386, base=374, interno=362
// EAR < 0.10 → olho fechado.
function areEyesOpen(landmarks: NormalizedLandmark[]): boolean {
	function ear(outer: number, top: number, bottom: number, inner: number) {
		const o = landmarks[outer]
		const t = landmarks[top]
		const b = landmarks[bottom]
		const i = landmarks[inner]
		if (!o || !t || !b || !i) return 1
		const vertical = Math.hypot(t.x - b.x, t.y - b.y)
		const horizontal = Math.hypot(o.x - i.x, o.y - i.y)
		return horizontal < 0.001 ? 1 : vertical / horizontal
	}
	const leftEAR = ear(33, 159, 145, 133)
	const rightEAR = ear(263, 386, 374, 362)
	return leftEAR > 0.1 && rightEAR > 0.1
}

function parseError(err: unknown): string {
	if (err instanceof DOMException) {
		switch (err.name) {
			case 'NotAllowedError':
				return 'Permissão negada. Habilite o acesso à câmera nas configurações do navegador.'
			case 'NotFoundError':
				return 'Nenhuma câmera encontrada neste dispositivo.'
			case 'NotReadableError':
				return 'A câmera está em uso por outro aplicativo.'
		}
	}
	return 'Não foi possível acessar a câmera.'
}

function isFaceInGuide(landmarks: NormalizedLandmark[], guide: Guide): boolean {
	if (!landmarks.length) return false

	let minX = Infinity,
		maxX = -Infinity,
		minY = Infinity,
		maxY = -Infinity
	for (const lm of landmarks) {
		if (lm.x < minX) minX = lm.x
		if (lm.x > maxX) maxX = lm.x
		if (lm.y < minY) minY = lm.y
		if (lm.y > maxY) maxY = lm.y
	}
	const cx = (minX + maxX) / 2
	const cy = (minY + maxY) / 2

	function insideEllipse(x: number, y: number) {
		const ex = (x - guide.cx) / guide.rx
		const ey = (y - guide.cy) / guide.ry
		return ex * ex + ey * ey <= 1
	}

	// O centro deve estar dentro e os 4 extremos do bounding box não podem ultrapassar a elipse
	return (
		insideEllipse(cx, cy) &&
		insideEllipse(minX, cy) &&
		insideEllipse(maxX, cy) &&
		insideEllipse(cx, minY) &&
		insideEllipse(cx, maxY)
	)
}

function drawScene(
	ctx: CanvasRenderingContext2D,
	landmarks: NormalizedLandmark[] | null,
	w: number,
	h: number,
) {
	ctx.clearRect(0, 0, w, h)

	if (landmarks) {
		// Tesselação — malha completa (desabilitada)
		// ctx.strokeStyle = 'rgba(0, 255, 128, 0.18)'
		// ctx.lineWidth = 1.5
		// ctx.beginPath()
		// for (const conn of FaceLandmarker.FACE_LANDMARKS_TESSELATION) {
		// 	const a = landmarks[conn.start]
		// 	const b = landmarks[conn.end]
		// 	if (!a || !b) continue
		// 	ctx.moveTo(a.x * w, a.y * h)
		// 	ctx.lineTo(b.x * w, b.y * h)
		// }
		// ctx.stroke()

		// Oval do rosto — contorno destacado
		ctx.strokeStyle = 'rgba(0, 255, 128, 0.85)'
		ctx.lineWidth = 5.5
		ctx.beginPath()
		for (const conn of FaceLandmarker.FACE_LANDMARKS_FACE_OVAL) {
			const a = landmarks[conn.start]
			const b = landmarks[conn.end]
			if (!a || !b) continue
			ctx.moveTo(a.x * w, a.y * h)
			ctx.lineTo(b.x * w, b.y * h)
		}
		ctx.stroke()
	}

	// Oval guia — desenhado por cima para estar sempre visível
	const guide = getGuide(w, h)
	const inGuide = landmarks ? isFaceInGuide(landmarks, guide) : false
	const proximity = landmarks ? getFaceProximity(landmarks, guide) : null
	const frontal = landmarks ? isFaceFrontal(landmarks) : null
	const eyesOpen = landmarks ? areEyesOpen(landmarks) : null

	const allGood =
		inGuide && proximity === 'ok' && frontal === true && eyesOpen === true
	const hasIssue =
		proximity === 'too_far' ||
		proximity === 'too_close' ||
		frontal === false ||
		eyesOpen === false

	let guideColor: string
	let dashPattern: number[]
	if (allGood) {
		guideColor = 'rgba(0,255,128,0.9)'
		dashPattern = []
	} else if (hasIssue) {
		guideColor = 'rgba(255,165,0,0.85)'
		dashPattern = [10, 8]
	} else {
		guideColor = 'rgba(255,255,255,0.55)'
		dashPattern = [10, 8]
	}

	ctx.beginPath()
	ctx.ellipse(
		guide.cx * w,
		guide.cy * h,
		guide.rx * w,
		guide.ry * h,
		0,
		0,
		Math.PI * 2,
	)
	ctx.strokeStyle = guideColor
	ctx.lineWidth = 5.5
	ctx.setLineDash(dashPattern)
	ctx.stroke()
	ctx.setLineDash([])
}

export function FaceMeshCapture({
	onClose,
	onConfirm,
	title,
}: FaceMeshCaptureProps) {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)

	const [cameraState, setCameraState] = useState<FaceMeshCameraState>('idle')
	const [errorMsg, setErrorMsg] = useState<string | null>(null)
	const [capturedBase64, setCapturedBase64] = useState<string | null>(null)

	const { isReady, landmarks } = useFaceMesh(videoRef)

	const faceInGuide = useMemo(() => {
		if (!landmarks) return false
		const video = videoRef.current
		const guide = getGuide(
			video?.videoWidth ?? 640,
			video?.videoHeight ?? 480,
		)
		return isFaceInGuide(landmarks, guide)
	}, [landmarks])

	const faceProximity = useMemo((): FaceProximity | null => {
		if (!landmarks) return null
		const video = videoRef.current
		const guide = getGuide(
			video?.videoWidth ?? 640,
			video?.videoHeight ?? 480,
		)
		return getFaceProximity(landmarks, guide)
	}, [landmarks])

	const stopStream = useCallback(() => {
		streamRef.current?.getTracks().forEach((t) => t.stop())
		streamRef.current = null
	}, [])

	const startStream = useCallback(async () => {
		setCameraState('idle')
		setErrorMsg(null)
		try {
			if (!navigator.mediaDevices?.getUserMedia) {
				throw new DOMException('', 'NotAllowedError')
			}
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: { ideal: 'user' },
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
			})
			streamRef.current = stream
			if (videoRef.current) {
				videoRef.current.srcObject = stream
			}
			setCameraState('streaming')
		} catch (err) {
			setErrorMsg(parseError(err))
			setCameraState('error')
		}
	}, [])

	useEffect(() => {
		startStream()
		return stopStream
	}, [startStream, stopStream])

	// Redesenha o canvas sempre que os landmarks são atualizados (inclui o oval guia)
	useEffect(() => {
		if (cameraState !== 'streaming') return

		const canvas = canvasRef.current
		const video = videoRef.current
		if (!canvas || !video) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const vw = video.videoWidth || 640
		const vh = video.videoHeight || 480

		if (canvas.width !== vw) canvas.width = vw
		if (canvas.height !== vh) canvas.height = vh

		drawScene(ctx, landmarks, vw, vh)
	}, [landmarks, cameraState])

	const captureFrame = useCallback(() => {
		const video = videoRef.current
		if (!video) return

		const canvas = document.createElement('canvas')
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		const ctx = canvas.getContext('2d')!
		ctx.drawImage(video, 0, 0)

		stopStream()
		setCapturedBase64(canvas.toDataURL('image/jpeg', 0.92))
		setCameraState('preview')
	}, [stopStream])

	const handleConfirm = useCallback(() => {
		if (capturedBase64) {
			onConfirm(capturedBase64)
			onClose()
		}
	}, [capturedBase64, onConfirm, onClose])

	const handleRetake = useCallback(() => {
		setCapturedBase64(null)
		startStream()
	}, [startStream])

	const handleClose = useCallback(() => {
		stopStream()
		onClose()
	}, [stopStream, onClose])

	const faceFrontal = useMemo(() => {
		if (!landmarks) return null
		return isFaceFrontal(landmarks)
	}, [landmarks])

	const eyesOpen = useMemo(() => {
		if (!landmarks) return null
		return areEyesOpen(landmarks)
	}, [landmarks])

	const canCapture =
		faceInGuide &&
		faceProximity === 'ok' &&
		faceFrontal === true &&
		eyesOpen === true

	const statusText =
		cameraState === 'idle'
			? isReady
				? 'Iniciando câmera...'
				: 'Carregando modelo facial...'
			: faceProximity === 'too_far'
				? 'Aproxime o rosto da câmera'
				: faceProximity === 'too_close'
					? 'Afaste um pouco o rosto'
					: faceFrontal === false
						? 'Olhe diretamente para a câmera'
						: eyesOpen === false
							? 'Mantenha os olhos abertos'
							: canCapture
								? 'Rosto enquadrado — pronto para capturar'
								: 'Centralize o rosto no guia oval'

	return (
		<div className='fmc-overlay'>
			<div className='fmc-modal'>
				{/* Cabeçalho */}
				<div className='fmc-header'>
					<div />
					<span className='fmc-title'>{title}</span>
					<button
						className='fmc-close-btn'
						onClick={handleClose}
						aria-label='Fechar'
					>
						<svg
							width='24'
							height='24'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
						>
							<line
								x1='18'
								y1='6'
								x2='6'
								y2='18'
							/>
							<line
								x1='6'
								y1='6'
								x2='18'
								y2='18'
							/>
						</svg>
					</button>
				</div>

				{/* Visor */}
				<div className='fmc-viewfinder'>
					{cameraState === 'preview' && capturedBase64 ? (
						<img
							src={capturedBase64}
							alt='Foto capturada'
							className='fmc-media'
						/>
					) : (
						<>
							<video
								ref={videoRef}
								autoPlay
								playsInline
								muted
								className='fmc-media fmc-media--mirror'
							/>
							<canvas
								ref={canvasRef}
								className='fmc-canvas'
							/>
						</>
					)}

					{cameraState === 'idle' && (
						<div className='fmc-loading'>
							<div className='fmc-spinner' />
						</div>
					)}

					{cameraState === 'error' && (
						<div className='fmc-error'>
							<svg
								width='32'
								height='32'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='1.5'
							>
								<circle
									cx='12'
									cy='12'
									r='10'
								/>
								<line
									x1='12'
									y1='8'
									x2='12'
									y2='12'
								/>
								<line
									x1='12'
									y1='16'
									x2='12.01'
									y2='16'
								/>
							</svg>
							<p>{errorMsg}</p>
						</div>
					)}
				</div>

				{/* Rótulo de status */}
				{cameraState !== 'preview' && cameraState !== 'error' && (
					<p
						className={
							canCapture
								? 'fmc-status fmc-status--detected'
								: faceProximity != null &&
									  (faceProximity !== 'ok' ||
											faceFrontal === false)
									? 'fmc-status fmc-status--warning'
									: 'fmc-status'
						}
					>
						{statusText}
					</p>
				)}

				{/* Botões de ação */}
				<div className='fmc-actions'>
					{cameraState === 'streaming' && (
						<Button
							type='primary'
							Label='Capturar'
							onClick={canCapture ? captureFrame : () => {}}
							disabled={!canCapture}
							icon={
								<Icon
									path={mdiCamera}
									size={1}
								/>
							}
						/>
					)}

					{cameraState === 'preview' && (
						<>
							<Button
								type='secondary'
								Label='Tirar novamente'
								onClick={handleRetake}
								icon={
									<Icon
										path={mdiCameraRetake}
										size={1}
									/>
								}
							/>
							<Button
								type='primary'
								Label='Confirmar'
								onClick={handleConfirm}
								icon={
									<Icon
										path={mdiCheck}
										size={1}
									/>
								}
							/>
						</>
					)}

					{cameraState === 'error' && (
						<Button
							type='secondary'
							Label='Tentar novamente'
							onClick={handleRetake}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
