import { useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { SignatureData, SignatureStep } from '../../domain/types'
import { ConfirmDataStep } from './components/Steps/ConfirmDataStep'
import PhotoDocumentStep from './components/Steps/PhotoDocumentStep'
import { ReadDocumentStep } from './components/Steps/ReadDocumentStep'
import SelfieStep from './components/Steps/SelfieStep'
import SignatureCaptureStep from './components/Steps/SignatureCaptureStep'
import { Wizard } from './components/Wizard'
import { dynamicResolver } from './schemas/signatureSchemas'
import './signature.css'
import { useSignatureStore } from './store/signature.store'

const stepContent: Record<
	SignatureStep,
	{ title: string; index: number; component?: () => ReactNode }
> = {
	read: {
		title: 'Leia o documento com atenção',
		index: 1,
		component: () => <ReadDocumentStep />,
	},
	confirm: {
		title: 'Confirme seus dados',
		index: 2,
		component: () => <ConfirmDataStep />,
	},
	document: {
		title: 'Foto do documento oficial',
		index: 3,
		component: () => <PhotoDocumentStep />,
	},
	selfie: {
		title: 'Selfie com o documento',
		index: 4,
		component: () => <SelfieStep />,
	},
	signature: {
		title: 'Assinatura Manuscrita',
		index: 5,
		component: () => <SignatureCaptureStep />,
	},
	token: { title: 'Token de autenticação', index: 6 },
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
		if (steps.length > 0 && !steps.includes(step)) {
			setStep(steps[0])
		}
	}, [steps, step, setStep])

	const currentIndex = steps.indexOf(step)

	const goNext = useMemo(
		() =>
			currentIndex < steps.length - 1
				? () => setStep(steps[currentIndex + 1])
				: undefined,
		[currentIndex, steps, setStep],
	)

	const goBack = useMemo(
		() =>
			currentIndex > 0
				? () => setStep(steps[currentIndex - 1])
				: undefined,
		[currentIndex, steps, setStep],
	)

	const methods = useForm<SignatureData>({
		resolver: dynamicResolver,
		defaultValues: currentData,
	})

	const handleNext = useCallback(
		() =>
			methods.handleSubmit(
				(formData) => {
					updateData(formData)
					goNext?.()
				},
				() =>
					toast.error(
						'Por favor, corrija os erros antes de avançar.',
					),
			)(),
		[methods, updateData, goNext],
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
					<Wizard.Body>{content.component?.()}</Wizard.Body>
				</main>
				<Wizard.CheckSteps onNext={handleNext} />
			</Wizard.Layout>
		</FormProvider>
	)
}
