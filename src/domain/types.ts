export type SignatureData = {
	documentPDFUrl?: string
	fullName?: string
	cpf?: string
	dateOfBirth?: string
	documentFrontBase64?: string
	documentBackBase64?: string
	selfieBase64?: string
	signatureBase64?: string
	signatureType: SignatureType
	token?: string
	fileReadingConfirmed?: boolean
	personalDataConfirmed?: boolean
	tokenSent?: boolean
}
export type SignatureType = 'typed' | 'drawed'

export type FormData = Partial<SignatureData>

export type SignatureStep =
	| 'read'
	| 'confirm'
	| 'document'
	| 'selfie'
	| 'signature'
	| 'token'

export type SignatureState = {
	step: SignatureStep
	data: SignatureData
	setStep: (step: SignatureStep) => void
	updateData: (data: Partial<SignatureData>) => void
	availableSteps: SignatureStep[]
	setAvailableSteps: (steps: SignatureStep[]) => void
	validByStep: Record<SignatureStep, boolean>
	setStepValid: (step: SignatureStep, valid: boolean) => void
	isCurrentStepValid: () => boolean
	reset: () => void
}
