export type ValidateBiometriaParams = {
	accessToken: string
	documentFrontBase64: string
	recognitionBase64: string
}

export type ValidateBiometriaResponse = {
	valid: boolean
	message: string
}
