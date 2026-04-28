// src/modules/signature/SignaturePage.tsx
import { useMemo } from 'react'
import { ErrorDisplay } from '../../components/ErrorDisplay'
import { SignatureSkeleton } from './components/SignatureSkeleton'
import { useSignatureData } from './hooks/useSignatureData'
import { useToken } from './hooks/useToken'
import { SignatureFlow } from './SignatureFlow'
import { filterStepsByPermissions } from './utils/filterStepsByPermissions'

export function SignaturePage() {
	const { data, isLoading, error, errorCode } = useSignatureData()
	const availableSteps = useMemo(
		() => filterStepsByPermissions(data?.documento),
		[data?.documento],
	)
	const {
		isLoading: isTokenLoading,
		error: tokenError,
		errorCode: tokenErrorCode,
	} = useToken()

	if (isLoading || isTokenLoading) return <SignatureSkeleton />
	if (error || tokenError || !data)
		return (
			<ErrorDisplay
				message={error ?? tokenError ?? 'Dados não encontrados.'}
				errorCode={errorCode ?? tokenErrorCode}
				onRetry={() => window.location.reload()}
			/>
		)

	return <SignatureFlow steps={availableSteps} />
}
