import { api } from '../../../../services/api'
import type { GetSignatureParams, GetSignatureResponse } from './types'

export const signatureService = {
	async getSignature({
		assinaturaId,
		contratoId,
	}: GetSignatureParams): Promise<GetSignatureResponse> {
		const { data } = await api.get<GetSignatureResponse>(
			`/assinatura/${assinaturaId}`,
			{
				params: {
					contrato: contratoId,
				},
			},
		)

		return data
	},
}
