// src/modules/signature/SignaturePage.tsx
import { useMemo } from 'react'
import { SignatureSkeleton } from './components/SignatureSkeleton'
import { useSignatureData } from './hooks/useSignatureData'
import { useToken } from './hooks/useToken'
import { SignatureFlow } from './SignatureFlow'
import { filterStepsByPermissions } from './utils/filterStepsByPermissions'

export function SignaturePage() {
	const { data, isLoading, error } = useSignatureData()
	const availableSteps = useMemo(
		() => filterStepsByPermissions(data?.documento),
		[data?.documento],
	)
	const { isLoading: isTokenLoading, error: tokenError } = useToken()

	if (isLoading || isTokenLoading) return <SignatureSkeleton />
	if (error || tokenError || !data)
		return <div>{error ?? tokenError ?? 'Dados não encontrados.'}</div>

	return <SignatureFlow steps={availableSteps} />
}
