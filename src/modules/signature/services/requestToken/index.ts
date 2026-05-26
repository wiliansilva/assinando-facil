import { api } from '../../../../services/api'
import type { TokenParams, TokenResponse } from './types'

export async function requestToken({
	assinaturaId,
	accessToken,
}: TokenParams): Promise<TokenResponse> {
	const { data } = await api.get<TokenResponse>(`/token/${assinaturaId}`, {
		params: {
			access_token: accessToken,
		},
	})

	return data
}
