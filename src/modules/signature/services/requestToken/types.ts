export type TokenResponse = {
	signatario_key: string
	datafinal_assinatura: string
	nome_documento: string
	situacao: string
	fechamento_automatico: string
	intervalo_lembrete: number
	tipo_autenticacao: string
	autenticacao_selfie: string
	autenticacao_foto: string
	autenticacao_manuscrito: string
	storage_key: string
	storage_key_assinado: string | null
	sha256_original: string
	sha256_assinado: string | null
	data_inclusao: string
	data_alteracao: string
}

export type TokenParams = {
	assinaturaId: string
	contratoId: string
}
