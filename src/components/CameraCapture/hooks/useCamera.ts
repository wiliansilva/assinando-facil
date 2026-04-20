import { useCallback, useEffect, useRef, useState } from 'react'
import type { CameraState } from '../types'
const VIDEO_CONSTRAINTS: MediaStreamConstraints = {
	video: {
		facingMode: 'user',
		width: { min: 1280, ideal: 1920, max: 2560 },
		height: { min: 720, ideal: 1080, max: 1440 },
	},
}

export function useCamera() {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const streamRef = useRef<MediaStream | null>(null)
	const isInitializing = useRef(false)
	const [state, setState] = useState<CameraState>('idle')
	const [error, setError] = useState<string | null>(null)
	const [preview, setPreview] = useState<string | null>(null)

	const stopStream = useCallback(() => {
		streamRef.current?.getTracks().forEach((t) => t.stop())
		streamRef.current = null
		if (videoRef.current) videoRef.current.srcObject = null
	}, [])

	const initCamera = useCallback(async () => {
		if (streamRef.current || isInitializing.current) return
		isInitializing.current = true
		setError(null)

		try {
			if (!navigator.mediaDevices?.getUserMedia) {
				throw new Error(
					'Acesso à câmera requer conexão segura (HTTPS). Tente acessar via HTTPS.',
				)
			}

			const media =
				await navigator.mediaDevices.getUserMedia(VIDEO_CONSTRAINTS)
			streamRef.current = media

			if (videoRef.current) {
				videoRef.current.srcObject = media
			}

			setState('streaming')
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err)
			setError(`Não foi possível acessar a câmera: ${message}`)
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

		setPreview(canvas.toDataURL('image/jpeg', 0.8))
		setState('preview')
		stopStream()
	}, [stopStream])

	const retake = useCallback(async () => {
		setPreview(null)
		setState('idle')
		await initCamera()
	}, [initCamera])

	const confirm = useCallback(
		async (onConfirm: (base64: string) => void, onClose: () => void) => {
			if (!preview) return

			const blob = await fetch(preview).then((r) => r.blob())

			const base64 = await blobToBase64(blob)

			onConfirm(base64)
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
		initCamera()
		return stopStream
	}, [initCamera, stopStream])

	const blobToBase64 = (blob: Blob): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onloadend = () => resolve(reader.result as string)
			reader.onerror = reject
			reader.readAsDataURL(blob)
		})
	}

	return { videoRef, state, error, preview, capture, retake, confirm, close }
}
