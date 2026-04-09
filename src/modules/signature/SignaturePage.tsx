// src/modules/signature/SignaturePage.tsx
import { useSignatureData } from './hooks/useSignatureData'
import { SignatureFlow } from './SignatureFlow'
import { filterStepsByPermissions } from './store/filterStepsByPermissions'

export function SignaturePage() {
	const { data, isLoading, error } = useSignatureData()

	if (isLoading) return <div>Carregando...</div>
	if (error || !data) return <div>{error ?? 'Dados não encontrados.'}</div>

	const availableSteps = filterStepsByPermissions(data.documento)

	return (
		<SignatureFlow
			steps={availableSteps}
			data={data}
		/>
	)
}
