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

	const data = useSignatureStore((state) => state.data)

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [response, setResponse] = useState<SignSignatureResponse | null>(null)

	const sign = useCallback(async () => {
		if (!assinaturaId || !accessToken) {
			const errorMsg = 'Parâmetros inválidos na URL.'
			setError(errorMsg)
			return null
		}

		setLoading(true)
		setError(null)

		try {
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
			return null
		} finally {
			setLoading(false)
		}
	}, [assinaturaId, accessToken, data])

	return {
		sign,
		loading,
		error,
		response,
	}
}
