import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { formatErrorMessage } from '../../../services/errorHandler'
import type { ApiError } from '../../../services/types'
import { requestToken } from '../services/requestToken'
import { useSignatureStore } from '../store/signature.store'

export function useToken() {
	const { id: assinaturaId } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const contratoId = searchParams.get('contrato')
	const { updateData, data: dataStore } = useSignatureStore()

	const isValidParams = Boolean(assinaturaId && contratoId)

	const [isLoading, setLoading] = useState(
		isValidParams && !dataStore.tokenSent,
	)
	const [isResending, setIsResending] = useState(false)
	const [error, setError] = useState<string | null>(
		isValidParams ? null : 'Parâmetros inválidos na URL.',
	)

	useEffect(() => {
		if (!isValidParams || dataStore.tokenSent) return
		requestToken({
			assinaturaId: assinaturaId!,
			contratoId: contratoId!,
		})
			.then(() => {
				updateData({ tokenSent: true })
			})
			.catch((error: ApiError) => {
				setError(formatErrorMessage(error))
			})
			.finally(() => setLoading(false))
	}, [
		isValidParams,
		assinaturaId,
		contratoId,
		updateData,
		dataStore.tokenSent,
	])

	async function resendToken() {
		if (!isValidParams || isResending) return

		setError(null)
		setIsResending(true)

		toast.promise(
			requestToken({
				assinaturaId: assinaturaId!,
				contratoId: contratoId!,
			}),
			{
				loading: 'Reenviando token...',
				success: () => {
					updateData({ tokenSent: true })
					return 'Token reenviado com sucesso!'
				},
				error: (err: ApiError) => {
					const message = formatErrorMessage(err)
					setError(message)
					return message
				},
				finally: () => setIsResending(false),
			},
		)
	}

	return { isLoading, isResending, error, resendToken }
}
