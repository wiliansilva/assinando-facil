import { api } from '../../../../services/api'
import type {
	ValidateBiometriaParams,
	ValidateBiometriaResponse,
} from './types'

export async function validateBiometria({
	accessToken,
	documentFrontBase64,
	recognitionBase64,
}: ValidateBiometriaParams): Promise<ValidateBiometriaResponse> {
	const { data } = await api.post<ValidateBiometriaResponse>(
		'/validacoes/biometria',
		{
			autenticacao_foto_frente_base64: documentFrontBase64,
			autenticacao_foto_selfie_base64: recognitionBase64,
		},
		{
			params: {
				access_token: accessToken,
			},
		},
	)

	return data
}
