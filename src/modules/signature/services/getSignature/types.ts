export type SignatureDocumentResponse = {
	documento_key: string
	datafinal_assinatura: string
	nome_documento: string
	data_inclusao: string
	data_alteracao: string
	url: string
}

export type SignatoryResponse = {
	signatario_key: string
	nome: string
	documento: string | null
	nascimento: string | null
	autenticacao_selfie: string
	autenticacao_doc_oficial: string
	autenticacao_manuscrito: string
	autenticacao_biometria: string
	autenticacao_token: string
}

export type EmpresaResponse = {
	nome: string
	cnpj: string
	logo_url: string
}

export type GetSignatureResponse = {
	documento: SignatureDocumentResponse
	signatario: SignatoryResponse
	empresa: EmpresaResponse
}

export type GetSignatureParams = {
	assinaturaId: string
	accessToken: string
}
