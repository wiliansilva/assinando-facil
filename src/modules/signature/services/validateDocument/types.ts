export type ValidateDocumentParams = {
	assinaturaId: string
	accessToken: string
	documentFrontBase64: string
	documentBackBase64: string
}

type DocumentQuality = {
	Brightness: number
	Sharpness: number
}

type DocumentPose = {
	Roll: number
	Yaw: number
	Pitch: number
}

type DocumentFront = {
	quality: DocumentQuality
	pose: DocumentPose
}

type DocumentBack = {
	campos_encontrados: string[]
	quantidade_campos_encontrados: number
}

type ValidateDocumentDetails = {
	frente: DocumentFront
	verso: DocumentBack
}

export type ValidateDocumentResponse = {
	valid: boolean
	message: string
	tipo_documento: string
	details: ValidateDocumentDetails
	hash_doc_frente: string
	hash_doc_verso: string
}
