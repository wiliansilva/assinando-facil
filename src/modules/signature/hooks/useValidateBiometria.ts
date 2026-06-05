import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import type { ApiError } from '../../../services/types'
import { validateBiometria } from '../services/validateBiometria'

export function useValidateBiometria() {
	const [searchParams] = useSearchParams()
	const [isValidating, setIsValidating] = useState(false)

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

			setIsValidating(true)
			return validateBiometria({
				accessToken,
				documentFrontBase64,
				recognitionBase64,
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
