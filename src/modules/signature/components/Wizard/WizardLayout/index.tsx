import type { ReactNode } from 'react'
import { useSignatureStore } from '../../../store/signature.store'
import type { SignatureStep } from '../../../domain/types'
import { WizardCheckSteps } from '../WizardCheckSteps'
import './style.css'

type WizardLayoutProps = {
	children: ReactNode
}

const flowSteps: { key: SignatureStep; label: string }[] = [
	{ key: 'read', label: 'Leia o documento com atenção' },
	{ key: 'confirm', label: 'Confirme seus dados' },
	{ key: 'document', label: 'Foto do documento oficial' },
	{ key: 'selfie', label: 'Selfie com o documento' },
	{ key: 'signature', label: 'Assinatura Manuscrita' },
	{ key: 'token', label: 'Token de autenticação' },
]

export function WizardLayout({ children }: WizardLayoutProps) {
	const step = useSignatureStore((state) => state.step)
	const currentStepIndex = flowSteps.findIndex(
		(flowStep) => flowStep.key === step,
	)
	const safeStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0

	return (
		<div className='wizard-layout'>
			<main className='wizard-layout__content'>{children}</main>

			<aside className='wizard-layout__sidebar'>
				<div className='wizard-layout__sidebar-inner'>
					<WizardCheckSteps
						currentStep={safeStepIndex}
						steps={flowSteps.map((flowStep) => flowStep.label)}
					/>
				</div>
			</aside>
		</div>
	)
}
