import { api } from '../../../../services/api'
import type { SignSignatureParams, SignSignatureResponse } from './types'

export async function signSignature({
	assinaturaId,
	accessToken,
	payload,
}: SignSignatureParams): Promise<SignSignatureResponse> {
	const { data } = await api.post<SignSignatureResponse>(
		`/assinatura/${assinaturaId}`,
		payload,
		{
			params: {
				access_token: accessToken,
			},
		},
	)

	return data
}
