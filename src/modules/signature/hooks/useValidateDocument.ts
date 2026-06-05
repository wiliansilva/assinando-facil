import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import type { ApiError } from '../../../services/types'
import { validateDocument } from '../services/validateDocument'

export function useValidateDocument() {
	const [searchParams] = useSearchParams()
	const [isValidating, setIsValidating] = useState(false)

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

			setIsValidating(true)
			return validateDocument({
				accessToken,
				documentFrontBase64,
				documentBackBase64,
			})
				.then((result) => {
					if (!result.valid) {
						return false
					}
					toast.success(result.message)
					return true
				})
				.catch((error: ApiError) => {
					throw error
				})
				.finally(() => setIsValidating(false))
		},
		[searchParams],
	)

	return { validate, isValidating }
}
