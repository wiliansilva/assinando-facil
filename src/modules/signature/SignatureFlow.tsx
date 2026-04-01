import { useEffect, type ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { SignatureData, SignatureStep } from '../../domain/types'
import { ConfirmDataStep } from './components/Steps/ConfirmDataStep'
import PhotoDocumentStep from './components/Steps/PhotoDocumentStep'
import { ReadDocumentStep } from './components/Steps/ReadDocumentStep'
import SelfieStep from './components/Steps/SelfieStep'
import { Wizard } from './components/Wizard'
import { dynamicResolver } from './schemas/signatureSchemas'
import './signature.css'
import { useSignatureStore } from './store/signature.store'

const stepContent: Record<
	SignatureStep,
	{
		title: string
		index: number
		content?: ReactNode
	}
> = {
	read: {
		title: 'Leia o documento com atenção',
		index: 1,
		content: <ReadDocumentStep />,
	},
	confirm: {
		title: 'Confirme seus dados',
		index: 2,
		content: <ConfirmDataStep />,
	},
	document: {
		title: 'Foto do documento oficial',
		index: 3,
		content: <PhotoDocumentStep />,
	},
	selfie: {
		title: 'Selfie com o documento',
		index: 4,
		content: <SelfieStep />,
	},
	signature: {
		title: 'Assinatura Manuscrita',
		index: 5,
	},
	token: {
		title: 'Token de autenticação',
		index: 6,
	},
}

export function SignatureFlow({ steps = [] }: { steps?: SignatureStep[] }) {
	const setStep = useSignatureStore((state) => state.setStep)
	const step = useSignatureStore((state) => state.step)
	const setAvailableSteps = useSignatureStore(
		(state) => state.setAvailableSteps,
	)
	const updateData = useSignatureStore((state) => state.updateData)
	const currentData = useSignatureStore((state) => state.data)

	useEffect(() => {
		setAvailableSteps(steps)
	}, [steps, setAvailableSteps])

	useEffect(() => {
		if (!steps.includes(step)) {
			setStep(steps[0])
		}
	}, [steps, step, setStep])

	const currentIndex = steps.indexOf(step)

	const goNext =
		currentIndex < steps.length - 1
			? () => {
					setStep(steps[currentIndex + 1])
				}
			: undefined

	const goBack =
		currentIndex > 0
			? () => {
					setStep(steps[currentIndex - 1])
				}
			: undefined

	const methods = useForm<SignatureData>({
		resolver: dynamicResolver,
		defaultValues: currentData,
	})

	const handleNext = methods.handleSubmit(
		(formData) => {
			console.log(formData)

			updateData(formData)
			goNext?.()
		},
		() => {
			toast.error('Por favor, corrija os erros antes de avançar.')
		},
	)

	const content = stepContent[step]

	return (
		<FormProvider {...methods}>
			<Wizard.Layout>
				<main className='wizard-layout__content'>
					<Wizard.Header
						title={content.title}
						stepNumber={currentIndex + 1}
						totalSteps={steps.length}
						onBack={goBack}
						onNext={handleNext}
					/>

					<Wizard.Body>{content.content}</Wizard.Body>
				</main>
				<Wizard.CheckSteps onNext={handleNext} />
			</Wizard.Layout>
		</FormProvider>
	)
}
