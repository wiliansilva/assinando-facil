import { api } from '../../../../services/api'
import type {
	ValidateSelfieDocumentoParams,
	ValidateSelfieDocumentoResponse,
} from './types'

export async function validateSelfieDocumento({
	assinaturaId,
	accessToken,
	selfieBase64,
}: ValidateSelfieDocumentoParams): Promise<ValidateSelfieDocumentoResponse> {
	const { data } = await api.post<ValidateSelfieDocumentoResponse>(
		`/validacoes/selfie-documento/${assinaturaId}`,
		{
			autenticacao_foto_selfie_base64: selfieBase64,
		},
		{
			params: {
				access_token: accessToken,
			},
		},
	)

	return data
}
