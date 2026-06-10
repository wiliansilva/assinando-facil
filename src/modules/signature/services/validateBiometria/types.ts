export type ValidateBiometriaParams = {
	assinaturaId: string
	accessToken: string
	documentFrontBase64: string
	recognitionBase64: string
}

export type ValidateBiometriaResponse = {
	valid: boolean
	message: string
	similaridade: number
	hash_doc_frente: string
	hash_selfie: string
}
