import type { ReactNode } from 'react'
import { Wizard } from '../components/Wizard'
import { SignatureProvider } from '../context/SignatureProvider'
import type { SignatureStep } from '../domain/types'
import { useSignatureStore } from '../store/signature.store'
import { ConfirmDataStep } from './ConfirmDataStep'
import { ReadDocumentStep } from './ReadDocumentStep'

type FlowStep = Exclude<SignatureStep, 'success'>

const stepContent: Record<
	FlowStep,
	{
		title: string
		description: string
		content?: ReactNode
		index: number
		back?: FlowStep
		next?: FlowStep
		defaultValid?: boolean
	}
> = {
	read: {
		title: 'Leia o documento com atenção',
		description: 'Conteúdo do contrato...',
		index: 1,
		next: 'confirm',
		defaultValid: true,
		content: <ReadDocumentStep />,
	},
	confirm: {
		title: 'Confirme seus dados',
		description: 'Confira e valide seus dados antes de prosseguir.',
		index: 2,
		back: 'read',
		next: 'document',
		defaultValid: false,
		content: <ConfirmDataStep />,
	},
	document: {
		title: 'Foto do documento oficial',
		description: 'Envie uma foto frente e verso do seu documento oficial.',
		index: 3,
		back: 'confirm',
		next: 'selfie',
		defaultValid: true,
	},
	selfie: {
		title: 'Selfie com o documento',
		description: 'Tire uma selfie segurando o documento para validação.',
		index: 4,
		back: 'document',
		next: 'signature',
		defaultValid: true,
	},
	signature: {
		title: 'Assinatura Manuscrita',
		description:
			'Desenhe ou envie sua assinatura para concluir o processo.',
		index: 5,
		back: 'selfie',
		next: 'token',
		defaultValid: true,
	},
	token: {
		title: 'Token de autenticação',
		description: 'Informe o token enviado para finalizar a assinatura.',
		index: 6,
		back: 'signature',
		defaultValid: false,
	},
}

type PlaceholderStepProps = {
	stepKey: FlowStep
}

export function PlaceholderStep({ stepKey }: PlaceholderStepProps) {
	const setStep = useSignatureStore((state) => state.setStep)
	const content = stepContent[stepKey]
	const handleBack = content.back
		? () => setStep(content.back as SignatureStep)
		: undefined
	const handleNext = content.next
		? () => setStep(content.next as SignatureStep)
		: undefined

	return (
		<SignatureProvider
			key={stepKey}
			defaultValid={content.defaultValid}
		>
			<Wizard.layout>
				<Wizard.Header
					title={content.title}
					step={content.index}
					totalSteps={6}
					onBack={handleBack}
					onNext={handleNext}
				/>

				<div
					style={{
						maxWidth: 720,
						margin: '64px auto 0',
						textAlign: 'center',
						color: '#667085',
					}}
				>
					<p
						style={{
							fontSize: 18,
							fontWeight: 700,
							marginBottom: 16,
							color: '#344054',
						}}
					>
						{content.title}
					</p>

					<p>{content.description}</p>
					{content.content}
				</div>
			</Wizard.layout>
		</SignatureProvider>
	)
}
