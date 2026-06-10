export type ValidateSelfieDocumentoParams = {
	assinaturaId: string
	accessToken: string
	selfieBase64: string
}

type SelfieQuality = {
	Brightness: number
	Sharpness: number
}

type SelfiePose = {
	Roll: number
	Yaw: number
	Pitch: number
}

type SelfieRosto = {
	quality: SelfieQuality
	pose: SelfiePose
}

type ValidateSelfieDocumentoDetails = {
	quantidade_rostos_detectados: number
	rostos: SelfieRosto[]
}

export type ValidateSelfieDocumentoResponse = {
	valid: boolean
	message: string
	details: ValidateSelfieDocumentoDetails
	hash_selfie: string
}
