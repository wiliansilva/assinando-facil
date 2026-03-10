import { Wizard } from '../components/Wizard'
import { useSignatureStore } from '../store/signature.store'

export function ReadDocumentStep() {
	const setStep = useSignatureStore((s) => s.setStep)

	return (
		<Wizard.layout>
			<Wizard.Header
				title='Leia o documento com atenção'
				step={1}
				totalSteps={6}
				onDownload={() => console.log('baixar documento')}
				onNext={() => setStep('confirm')}
			/>

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
		</Wizard.layout>
	)
}
