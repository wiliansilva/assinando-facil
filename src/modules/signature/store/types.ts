export type SignatureData = {
	fullName?: string
	cpf?: string
	dateOfBirth?: string
	documentFrontUrl?: string
	documentBackUrl?: string
	selfieUrl?: string
	signatureImage?: string
	token?: string
	fileReadingConfirmed?: boolean
	personalDataConfirmed?: boolean
}

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
