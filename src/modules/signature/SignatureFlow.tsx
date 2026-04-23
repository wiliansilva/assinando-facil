import { useCallback, useEffect, useState, type ComponentType } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { LoadingSuccess } from '../../components/LoadingSuccess'
import type { SignatureData, SignatureStep } from '../../domain/types'
import { ConfirmDataStep } from './components/Steps/ConfirmDataStep'
import PhotoDocumentStep from './components/Steps/PhotoDocumentStep'
import { ReadDocumentStep } from './components/Steps/ReadDocumentStep'
import SelfieStep from './components/Steps/SelfieStep'
import SignatureCaptureStep from './components/Steps/SignatureCaptureStep'
import SuccessStep from './components/Steps/SuccessStep'
import TokenStep from './components/Steps/TokenStep'
import { Wizard } from './components/Wizard'
import { useGeolocation } from './hooks/useGeolocation'
import { useSignatureNavigation } from './hooks/useSignatureNavigation'
import { useSignatureSubmit } from './hooks/useSignatureSubmit'
import { dynamicResolver } from './schemas/signatureSchemas'
import './signature.css'
import { useSignatureStore } from './store/signature.store'

// stepContent — componentes referenciados diretamente
type StepConfig = {
	title: string
	index: number
	Component?: ComponentType
}

const stepContent: Record<SignatureStep, StepConfig> = {
	read: {
		title: 'Leia o documento com atenção',
		index: 1,
		Component: ReadDocumentStep,
	},
	confirm: {
		title: 'Confirme seus dados',
		index: 2,
		Component: ConfirmDataStep,
	},
	document: {
		title: 'Foto do documento oficial',
		index: 3,
		Component: PhotoDocumentStep,
	},
	selfie: {
		title: 'Selfie com o documento',
		index: 4,
		Component: SelfieStep,
	},
	signature: {
		title: 'Assinatura Manuscrita',
		index: 5,
		Component: SignatureCaptureStep,
	},
	token: { title: 'Token de autenticação', index: 6, Component: TokenStep },
	success: { title: 'Sucesso', index: 7, Component: SuccessStep },
}

// SignatureFlow.tsx — componente limpo
export function SignatureFlow({ steps = [] }: { steps?: SignatureStep[] }) {
	const step = useSignatureStore((s) => s.step)
	const setStep = useSignatureStore((s) => s.setStep)
	const setAvailableSteps = useSignatureStore((s) => s.setAvailableSteps)
	const currentData = useSignatureStore((s) => s.data)
	const updateData = useSignatureStore((s) => s.updateData)

	const hasLocation = Boolean(currentData.latitude && currentData.longitude)
	const { status: geoStatus, coords } = useGeolocation(hasLocation)

	useEffect(() => {
		if (geoStatus === 'success' && coords) {
			updateData(coords)
		}
	}, [geoStatus, coords, updateData])

	const [showLoadingSuccess, setShowLoadingSuccess] = useState(false)

	const { currentIndex, goNext, goBack } = useSignatureNavigation(steps)
	const { handleSubmit: submit, isLoading } = useSignatureSubmit(
		steps,
		currentIndex,
		goNext,
		() => setShowLoadingSuccess(true),
		() => setShowLoadingSuccess(false),
	)

	const methods = useForm<SignatureData>({
		resolver: dynamicResolver,
		defaultValues: currentData,
	})

	// Sincroniza o form com os dados do store ao trocar de step
	useEffect(() => {
		methods.reset(currentData)
	}, [step]) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setAvailableSteps(steps)
	}, [steps, setAvailableSteps])

	useEffect(() => {
		if (steps.length > 0 && !steps.includes(step) && step !== 'success') {
			setStep(steps[0])
		}
	}, [steps, step, setStep])

	const { title, Component } = stepContent[step]
	const handleNext = useCallback(() => submit(methods), [submit, methods])

	if (showLoadingSuccess) {
		return (
			<LoadingSuccess
				isLoading={isLoading}
				onComplete={() => {
					setShowLoadingSuccess(false)
					setStep('success')
				}}
			/>
		)
	}

	if (step === 'success') {
		return Component ? <Component /> : null
	}

	return (
		<FormProvider {...methods}>
			<Wizard.Layout>
				<main
					className='wizard-layout__content'
					data-step={step}
				>
					<Wizard.Header
						title={title}
						stepNumber={currentIndex + 1}
						totalSteps={steps.length}
						onBack={goBack}
						onNext={handleNext}
						disableNext={isLoading}
					/>
					<Wizard.Body>{Component && <Component />}</Wizard.Body>
				</main>
				<Wizard.CheckSteps
					onNext={handleNext}
					onBack={goBack}
				/>
			</Wizard.Layout>
		</FormProvider>
	)
}
