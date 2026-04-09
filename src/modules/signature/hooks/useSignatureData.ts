import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { formatErrorMessage } from '../../../services/errorHandler'
import { signatureService } from '../services/signature.service'
import type { ApiError, GetSignatureResponse } from '../services/types'

export function useSignatureData() {
	const { id: assinaturaId } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const contratoId = searchParams.get('contrato')

	const isValidParams = Boolean(assinaturaId && contratoId)

	const [data, setData] = useState<GetSignatureResponse | null>(null)
	const [isLoading, setLoading] = useState(isValidParams)
	const [error, setError] = useState<string | null>(
		isValidParams ? null : 'Parâmetros inválidos na URL.',
	)

	useEffect(() => {
		if (!isValidParams) return

		signatureService
			.getSignature({
				assinaturaId: assinaturaId!,
				contratoId: contratoId!,
			})
			.then(setData)
			.catch((error: ApiError) => {
				setError(formatErrorMessage(error))
			})
			.finally(() => setLoading(false))
	}, [isValidParams, assinaturaId, contratoId])

	return { data, isLoading, error }
}
