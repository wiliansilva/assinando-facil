import { api } from '../../../../services/api'
import type { TokenParams, TokenResponse } from './types'

export async function requestToken({
	assinaturaId,
	contratoId,
}: TokenParams): Promise<TokenResponse> {
	const { data } = await api.get<TokenResponse>(`/token/${assinaturaId}`, {
		params: {
			contrato: contratoId,
		},
	})

	return data
}
