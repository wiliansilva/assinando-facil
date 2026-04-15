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
	latitude?: string
	longitude?: string
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
	| 'success'

export type SignSignaturePayload = {
	token: string
	signatario: {
		documento: string
		nascimento: string
	}
	latitude: string
	longitude: string
	autenticacao_manuscrito_base64: string
	autenticacao_selfie_base64: string
	autenticacao_foto_frente_base64: string
	autenticacao_foto_verso_base64: string
}

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
