import { useCallback, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import type { ApiError } from '../../../services/types'
import { validateSelfieDocumento } from '../services/validateSelfieDocumento'
import { useSignatureStore } from '../store/signature.store'

export function useValidateSelfieDocumento() {
	const [searchParams] = useSearchParams()
	const [isValidating, setIsValidating] = useState(false)
	const { id: assinaturaId } = useParams<{ id: string }>()
	const updateData = useSignatureStore((s) => s.updateData)

	const validate = useCallback(
		async (selfieBase64: string): Promise<boolean> => {
			const accessToken = searchParams.get('access_token')
			if (!accessToken) {
				toast.error('Token de acesso não encontrado.')
				return false
			}

			if (!assinaturaId) {
				toast.error('Documento não encontrado.')
				return false
			}

			setIsValidating(true)
			return validateSelfieDocumento({
				assinaturaId,
				accessToken,
				selfieBase64,
			})
				.then((result) => {
					if (!result.valid) {
						return false
					}
					updateData({ hash_selfie: result.hash_selfie })
					toast.success(result.message)
					return true
				})
				.catch((error: ApiError) => {
					throw error
				})
				.finally(() => setIsValidating(false))
		},
		[searchParams, assinaturaId, updateData],
	)

	return { validate, isValidating }
}
