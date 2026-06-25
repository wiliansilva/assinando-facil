// src/modules/signature/SignaturePage.tsx
import { useMemo } from 'react'
import { ErrorDisplay } from '../../components/ErrorDisplay'
import { SignatureSkeleton } from './components/SignatureSkeleton'
import { useSignatureData } from './hooks/useSignatureData'
import { useToken } from './hooks/useToken'
import { SignatureFlow } from './SignatureFlow'
import { useSignatureStore } from './store/signature.store'
import { filterStepsByPermissions } from './utils/filterStepsByPermissions'

export function SignaturePage() {
	const { data, isLoading, error, errorCode } = useSignatureData()

	// Calcula os steps a partir da resposta da API. Memoizado só em `data`
	// (referência estável, setada uma vez) para não recriar o array a cada
	// update do store — senão entra em loop com o setAvailableSteps do
	// SignatureFlow, que reescreve os steps de volta no store.
	const storeSteps = useSignatureStore((s) => s.availableSteps)
	const apiSteps = useMemo(
		() =>
			data?.signatario ? filterStepsByPermissions(data.signatario) : null,
		[data],
	)
	// Quando o fetch é pulado (store já hidratado), data é null e caímos
	// nos steps já persistidos no store.
	const availableSteps = apiSteps ?? storeSteps

	const {
		isLoading: isTokenLoading,
		error: tokenError,
		errorCode: tokenErrorCode,
	} = useToken()

	if (isLoading || isTokenLoading) return <SignatureSkeleton />
	if (error || tokenError || availableSteps.length === 0)
		return (
			<ErrorDisplay
				message={error ?? tokenError ?? 'Dados não encontrados.'}
				errorCode={errorCode ?? tokenErrorCode}
				onRetry={() => window.location.reload()}
			/>
		)

	return <SignatureFlow steps={availableSteps} />
}
