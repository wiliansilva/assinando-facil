export type SignatureDocumentResponse = {
	storage_key: string
	datafinal_assinatura: string
	nome_documento: string
	autenticacao_selfie: string
	autenticacao_foto: string
	autenticacao_manuscrito: string
	data_inclusao: string
	data_alteracao: string
	url: string
}

export type SignatoryResponse = {
	signatario_key: string
	nome: string
	documento: string
	nascimento: string
}

export type GetSignatureResponse = {
	documento: SignatureDocumentResponse
	signatario: SignatoryResponse
}

export type GetSignatureParams = {
	assinaturaId: string
	contratoId: string
}

export type ApiErrorResponse = {
	erros: string[]
}

export type ApiError = {
	message: string
	errors: string[]
	statusCode?: number
}
