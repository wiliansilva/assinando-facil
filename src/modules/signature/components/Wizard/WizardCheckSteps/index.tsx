import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import Button from '../../../../../components/Button'
import { Input } from '../../../../../components/Input'
import { FormCheckbox } from '../../../../../components/Input/variations/form/FormCheckbox'
import { useSignatureStore } from '../../../store/signature.store'
import type { SignatureData, SignatureStep } from '../../../store/types'
import './style.css'

const flowSteps: { key: SignatureStep; label: string }[] = [
	{ key: 'read', label: 'Leia o documento com atenção' },
	{ key: 'confirm', label: 'Confirme seus dados' },
	{ key: 'document', label: 'Foto do documento oficial' },
	{ key: 'selfie', label: 'Selfie com o documento' },
	{ key: 'signature', label: 'Assinatura Manuscrita' },
	{ key: 'token', label: 'Token de autenticação' },
]

export function WizardCheckSteps({ onNext }: { onNext?: () => void }) {
	const step = useSignatureStore((state) => state.step)
	const { availableSteps } = useSignatureStore()
	const orderedSteps = availableSteps

	const current = orderedSteps.includes(step as SignatureStep)
		? (step as SignatureStep)
		: orderedSteps[0]

	const currentStep = orderedSteps.indexOf(current)

	const {
		control,
		watch,
		formState: { errors },
	} = useFormContext<Partial<SignatureData>>()

	const setStepValid = useSignatureStore((state) => state.setStepValid)
	useEffect(() => {
		setStepValid('read', watch('fileReadingConfirmed') ?? false)
	}, [watch, watch('fileReadingConfirmed'), setStepValid])

	return (
		<aside className='wizard-layout__sidebar'>
			<div className='wizard-layout__sidebar-inner'>
				<section className='wizard-check-steps'>
					<div className='wizard-check-steps__brand'>
						<div
							aria-hidden='true'
							className='wizard-check-steps__logo'
						>
							<img src='https://rbxsoft.com/wp-content/uploads/2023/05/cropped-RBXSoft-Padrao.png' />
						</div>
						<p className='wizard-check-steps__company'>
							RBXSoft Company
						</p>
					</div>

					<div className='wizard-check-steps__intro'>
						<h1>Vamos assinar!</h1>
						<p>Siga os passos para concluir sua assinatura</p>
					</div>

					<ol className='wizard-check-steps__timeline'>
						{availableSteps.map((step, index) => {
							const isCompleted = index < currentStep
							const isActive = index === currentStep

							return (
								<li
									key={step}
									className={`wizard-check-steps__item ${
										isCompleted
											? 'wizard-check-steps__item--completed'
											: ''
									} ${
										isActive
											? 'wizard-check-steps__item--active'
											: ''
									}`}
								>
									<span className='wizard-check-steps__marker'>
										{isCompleted && (
											<span className='wizard-check-steps__marker-check'>
												&#10003;
											</span>
										)}
										{isActive && (
											<span className='wizard-check-steps__marker-dots'>
												<span />
												<span />
												<span />
											</span>
										)}
									</span>
									<span className='wizard-check-steps__label'>
										{flowSteps.find((s) => s.key === step)
											?.label || step}
									</span>
								</li>
							)
						})}
					</ol>
					{step === 'read' && (
						<div className='wizard-check-steps__confirmation'>
							<Input.Root>
								<FormCheckbox
									name='fileReadingConfirmed'
									control={control}
									label='Confirmo que verifiquei o documento.'
									errorMessage={
										errors.fileReadingConfirmed?.message
									}
								/>
							</Input.Root>
							{onNext && (
								<Button
									Label='Começar'
									type='primary'
									onClick={onNext}
									disabled={
										watch('fileReadingConfirmed') !== true
									}
								/>
							)}
						</div>
					)}
				</section>
			</div>
		</aside>
	)
}
