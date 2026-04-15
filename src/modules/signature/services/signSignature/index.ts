import { api } from '../../../../services/api'
import type { SignSignatureParams, SignSignatureResponse } from './types'

export async function signSignature({
	assinaturaId,
	contratoId,
	payload,
}: SignSignatureParams): Promise<SignSignatureResponse> {
	const { data } = await api.post<SignSignatureResponse>(
		`/assinatura/${assinaturaId}`,
		payload,
		{
			params: {
				contrato: contratoId,
			},
		},
	)

	return data
}
