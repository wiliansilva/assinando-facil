import { useCallback, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import type { ApiError } from '../../../services/types'
import { validateDocument } from '../services/validateDocument'
import { useSignatureStore } from '../store/signature.store'

export function useValidateDocument() {
	const { id: assinaturaId } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const [isValidating, setIsValidating] = useState(false)
	const updateData = useSignatureStore((s) => s.updateData)

	const validate = useCallback(
		async (
			documentFrontBase64: string,
			documentBackBase64: string,
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
			const document = useSignatureStore.getState().data.cpf ?? ''
			return validateDocument({
				assinaturaId,
				accessToken,
				documentFrontBase64,
				documentBackBase64,
				document,
			})
				.then((result) => {
					if (!result.valid) {
						return false
					}
					updateData({
						hash_doc_frente: result.hash_doc_frente,
						hash_doc_verso: result.hash_doc_verso,
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
