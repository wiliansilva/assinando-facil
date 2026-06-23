import { useCallback, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { formatErrorMessage } from '../../../services/errorHandler'
import type { ApiError } from '../../../services/types'
import { signSignature } from '../services/signSignature'
import type { SignSignatureResponse } from '../services/signSignature/types'
import { useSignatureStore } from '../store/signature.store'
import { buildSignSignaturePayload } from '../utils/buildSignSignaturePayload'

export function useSignSignature() {
	const { id: assinaturaId } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const accessToken = searchParams.get('access_token')

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [response, setResponse] = useState<SignSignatureResponse | null>(null)

	const sign = useCallback(async (): Promise<SignSignatureResponse> => {
		if (!assinaturaId || !accessToken) {
			const errorMsg = 'Parâmetros inválidos na URL.'
			setError(errorMsg)
			const errorResponse: SignSignatureResponse = {
				sucesso: false,
				mensagem_erro: errorMsg,
				data_assinatura: '',
			}
			setResponse(errorResponse)
			return errorResponse
		}

		setLoading(true)
		setError(null)

		try {
			// Lê o estado mais recente no momento da chamada para evitar
			// closure desatualizado (o updateData anterior já foi aplicado).
			const data = useSignatureStore.getState().data
			const payload = buildSignSignaturePayload(data)

			const result = await signSignature({
				assinaturaId,
				accessToken,
				payload,
			})

			setResponse(result)
			return result
		} catch (err: unknown) {
			const apiError = err as ApiError
			const errorMsg = formatErrorMessage(apiError)
			setError(errorMsg)
			const errorResponse: SignSignatureResponse = {
				sucesso: false,
				mensagem_erro: errorMsg,
				data_assinatura: '',
			}
			setResponse(errorResponse)
			return errorResponse
		} finally {
			setLoading(false)
		}
	}, [assinaturaId, accessToken])

	return {
		sign,
		loading,
		error,
		response,
	}
}
