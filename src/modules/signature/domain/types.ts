export type SignatureData = {
	fullName: string
	cpf: string
	email: string
	phone: string
	documentFrontUrl?: string
	documentBackUrl?: string
	selfieUrl?: string
	signatureImage?: string
	token?: string
}

export type SignatureStep =
	| 'read'
	| 'confirm'
	| 'document'
	| 'selfie'
	| 'signature'
	| 'token'
	| 'success'
