import { api } from '../../../../services/api'
import type { GetSignatureParams, GetSignatureResponse } from './types'

export const signatureService = {
	async getSignature({
		assinaturaId,
		accessToken,
	}: GetSignatureParams): Promise<GetSignatureResponse> {
		const { data } = await api.get<GetSignatureResponse>(
			`/assinatura/${assinaturaId}`,
			{
				params: {
					access_token: accessToken,
				},
			},
		)

		return data
	},
}
