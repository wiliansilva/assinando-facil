import { WizardLayout } from '../components/WizardLayout'
import { useSignatureStore } from '../store/signature.store'

export function ReadDocumentStep() {
	const setStep = useSignatureStore((s) => s.setStep)

	return (
		<WizardLayout
			title='Revise o documento'
			onNext={() => setStep('confirm')}
		>
			<p>
				Você está iniciando a assinatura deste contrato. Leia
				atentamente antes de prosseguir.
			</p>

			<div
				style={{
					height: 200,
					overflow: 'auto',
					border: '1px solid #ccc',
					padding: 10,
				}}
			>
				<p>Conteúdo do contrato...</p>
			</div>
		</WizardLayout>
	)
}
