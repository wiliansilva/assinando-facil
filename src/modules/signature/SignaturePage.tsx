// src/modules/signature/SignaturePage.tsx
import { useMemo } from 'react'
import { useSignatureData } from './hooks/useSignatureData'
import { SignatureFlow } from './SignatureFlow'
import { filterStepsByPermissions } from './utils/filterStepsByPermissions'

export function SignaturePage() {
	const { data, isLoading, error } = useSignatureData()
	const availableSteps = useMemo(
		() => filterStepsByPermissions(data?.documento),
		[data?.documento],
	)

	if (isLoading) return <div>Carregando...</div>
	if (error || !data) return <div>{error ?? 'Dados não encontrados.'}</div>

	return <SignatureFlow steps={availableSteps} />
}
