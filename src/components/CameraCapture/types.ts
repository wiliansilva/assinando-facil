export type CameraCaptureProps = {
	onClose: () => void
	onConfirm: (base64: string) => void
	title: string
	showGuide?: boolean
}

export type CameraState = 'idle' | 'streaming' | 'preview' | 'error'
