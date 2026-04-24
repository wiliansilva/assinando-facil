import { useCallback, useEffect, useRef, useState } from 'react'
import type { CameraState } from '../types'

type FacingMode = 'environment' | 'user'

interface ExtendedTrackCapabilities extends MediaTrackCapabilities {
	torch?: boolean
}

function buildConstraints(facing: FacingMode): MediaStreamConstraints {
	return {
		video: {
			facingMode: { ideal: facing },
			width: { min: 1280, ideal: 1920, max: 3840 },
			height: { min: 720, ideal: 1080, max: 2160 },
		},
	}
}

function blobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onloadend = () => resolve(reader.result as string)
		reader.onerror = reject
		reader.readAsDataURL(blob)
	})
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
			case 'OverconstrainedError':
				return 'Câmera não suporta a resolução solicitada. Tente com outro dispositivo.'
		}
	}
	return 'Não foi possível acessar a câmera.'
}

export function useCamera() {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const isInitializing = useRef(false)
	const facingRef = useRef<FacingMode>('environment')

	const [state, setState] = useState<CameraState>('idle')
	const [error, setError] = useState<string | null>(null)
	const [preview, setPreview] = useState<string | null>(null)
	const [facing, setFacing] = useState<FacingMode>('environment')
	const [hasTorch, setHasTorch] = useState(false)
	const [torchOn, setTorchOn] = useState(false)
	const [hasMultipleCameras, setHasMultipleCameras] = useState(false)

	const stopStream = useCallback(() => {
		streamRef.current?.getTracks().forEach((t) => t.stop())
		streamRef.current = null
		if (videoRef.current) videoRef.current.srcObject = null
		setHasTorch(false)
		setTorchOn(false)
	}, [])

	const startCamera = useCallback(async () => {
		if (streamRef.current || isInitializing.current) return
		isInitializing.current = true
		setError(null)
		setState('idle')

		try {
			if (!navigator.mediaDevices?.getUserMedia) {
				throw new Error(
					'Acesso à câmera requer conexão segura (HTTPS).',
				)
			}

			const devices = await navigator.mediaDevices.enumerateDevices()
			const videoDevices = devices.filter((d) => d.kind === 'videoinput')
			setHasMultipleCameras(videoDevices.length > 1)

			const media = await navigator.mediaDevices.getUserMedia(
				buildConstraints(facingRef.current),
			)
			streamRef.current = media

			const track = media.getVideoTracks()[0]
			const caps = track.getCapabilities() as ExtendedTrackCapabilities
			setHasTorch(caps.torch === true)

			if (videoRef.current) {
				videoRef.current.srcObject = media
			}

			setState('streaming')
		} catch (err) {
			setError(parseError(err))
			setState('error')
		} finally {
			isInitializing.current = false
		}
	}, [])

	const capture = useCallback(() => {
		const video = videoRef.current
		if (!video) return

		const MAX_WIDTH = 480
		const scale = Math.min(1, MAX_WIDTH / video.videoWidth)
		const canvas = document.createElement('canvas')
		canvas.width = Math.round(video.videoWidth * scale)
		canvas.height = Math.round(video.videoHeight * scale)
		canvas
			.getContext('2d')
			?.drawImage(video, 0, 0, canvas.width, canvas.height)

		setPreview(canvas.toDataURL('image/jpeg', 0.92))
		setState('preview')
		stopStream()
	}, [stopStream])

	const toggleTorch = useCallback(async () => {
		const track = streamRef.current?.getVideoTracks()[0]
		if (!track) return
		const next = !torchOn
		await track.applyConstraints({
			advanced: [{ torch: next } as unknown as MediaTrackConstraintSet],
		})
		setTorchOn(next)
	}, [torchOn])

	const switchCamera = useCallback(async () => {
		stopStream()
		const next: FacingMode =
			facingRef.current === 'environment' ? 'user' : 'environment'
		facingRef.current = next
		setFacing(next)
		isInitializing.current = false
		await startCamera()
	}, [stopStream, startCamera])

	const retake = useCallback(async () => {
		setPreview(null)
		setState('idle')
		isInitializing.current = false
		await startCamera()
	}, [startCamera])

	const confirm = useCallback(
		async (onConfirm: (base64: string) => void, onClose: () => void) => {
			if (!preview) return
			const blob = await fetch(preview).then((r) => r.blob())
			onConfirm(await blobToBase64(blob))
			stopStream()
			onClose()
		},
		[preview, stopStream],
	)

	const close = useCallback(
		(onClose: () => void) => {
			stopStream()
			onClose()
		},
		[stopStream],
	)

	useEffect(() => {
		startCamera()
		return stopStream
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return {
		videoRef,
		state,
		error,
		preview,
		facing,
		hasTorch,
		torchOn,
		hasMultipleCameras,
		capture,
		retake,
		confirm,
		close,
		toggleTorch,
		switchCamera,
	}
}
