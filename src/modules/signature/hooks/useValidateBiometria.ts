import { useCallback, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import type { ApiError } from '../../../services/types'
import { validateBiometria } from '../services/validateBiometria'
import { useSignatureStore } from '../store/signature.store'

export function useValidateBiometria() {
	const { id: assinaturaId } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const [isValidating, setIsValidating] = useState(false)
	const updateData = useSignatureStore((s) => s.updateData)

	const validate = useCallback(
		async (
			documentFrontBase64: string,
			recognitionBase64: string,
		): Promise<boolean> => {
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
			return validateBiometria({
				assinaturaId,
				accessToken,
				documentFrontBase64,
				recognitionBase64,
			})
				.then((result) => {
					if (!result.valid) {
						return false
					}
					updateData({
						hash_doc_frente: result.hash_doc_frente,
						hash_selfie: result.hash_selfie,
					})
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
