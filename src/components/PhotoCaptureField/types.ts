import type { SignatureData } from '../../domain/types'

export type PhotoCaptureFieldProps = {
	label: string
	fieldName: keyof Pick<
		SignatureData,
		'documentFrontBase64' | 'documentBackBase64' | 'selfieBase64'
	>
	placeholderSrc: string
	cameraTitle: string
}
