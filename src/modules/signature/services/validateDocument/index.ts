import { api } from '../../../../services/api'
import type { ValidateDocumentParams, ValidateDocumentResponse } from './types'

export async function validateDocument({
	assinaturaId,
	accessToken,
	documentFrontBase64,
	documentBackBase64,
}: ValidateDocumentParams): Promise<ValidateDocumentResponse> {
	const { data } = await api.post<ValidateDocumentResponse>(
		`/validacoes/documento-oficial/${assinaturaId}`,
		{
			autenticacao_foto_frente_base64: documentFrontBase64,
			autenticacao_foto_verso_base64: documentBackBase64,
		},
		{
			params: {
				access_token: accessToken,
			},
		},
	)

	return data
}
