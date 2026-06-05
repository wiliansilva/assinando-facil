import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import type { ApiError } from '../../../services/types'
import { validateSelfieDocumento } from '../services/validateSelfieDocumento'

export function useValidateSelfieDocumento() {
	const [searchParams] = useSearchParams()
	const [isValidating, setIsValidating] = useState(false)

	const validate = useCallback(
		async (selfieBase64: string): Promise<boolean> => {
			const accessToken = searchParams.get('access_token')
			if (!accessToken) {
				toast.error('Token de acesso não encontrado.')
				return false
			}

			setIsValidating(true)
			return validateSelfieDocumento({ accessToken, selfieBase64 })
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
