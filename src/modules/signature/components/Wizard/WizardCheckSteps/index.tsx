import { mdiCheck, mdiChevronDown, mdiChevronUp } from '@mdi/js'
import Icon from '@mdi/react'
import { Fragment, useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import Button from '../../../../../components/Button'
import { Input } from '../../../../../components/Input'
import { FormCheckbox } from '../../../../../components/Input/variations/form/FormCheckbox'
import type { SignatureData, SignatureStep } from '../../../../../domain/types'
import { useSignatureStore } from '../../../store/signature.store'
import './style.css'

const flowSteps: { key: SignatureStep; label: string }[] = [
	{ key: 'read', label: 'Leia o documento com atenção' },
	{ key: 'confirm', label: 'Confirme seus dados' },
	{ key: 'document', label: 'Foto do documento oficial' },
	{ key: 'selfie', label: 'Selfie com o documento' },
	{ key: 'signature', label: 'Assinatura Manuscrita' },
	{ key: 'token', label: 'Token de autenticação' },
]

export function WizardCheckSteps({
	onNext,
	onBack,
}: {
	onNext?: () => void
	onBack?: () => void
}) {
	const step = useSignatureStore((state) => state.step)
	const { availableSteps } = useSignatureStore()
	const orderedSteps = availableSteps

	const current = orderedSteps.includes(step as SignatureStep)
		? (step as SignatureStep)
		: orderedSteps[0]

	const currentStep = orderedSteps.indexOf(current)
	const currentStepLabel =
		flowSteps.find((s) => s.key === current)?.label ?? current

	/* expandedStep guarda a key do step em que o painel foi aberto;
	   se o step mudar, stepsExpanded fica false automaticamente — sem useEffect */
	const [expandedStep, setExpandedStep] = useState<string | null>(null)
	const stepsExpanded = expandedStep === step

	const {
		control,
		watch,
		formState: { errors },
	} = useFormContext<Partial<SignatureData>>()

	const fileReadingConfirmed = useWatch({
		control,
		name: 'fileReadingConfirmed',
	})

	const setStepValid = useSignatureStore((state) => state.setStepValid)
	useEffect(() => {
		setStepValid('read', fileReadingConfirmed ?? false)
	}, [fileReadingConfirmed, setStepValid])

	return (
		<aside className='wizard-layout__sidebar'>
			<div className='wizard-layout__sidebar-inner'>
				<section className='wizard-check-steps'>
					{/* ════════════════════════════════════
					    MOBILE: header integrado e colapsável
					    ════════════════════════════════════ */}
					<div className='wcs-mobile'>
						{/* Linha 1: logo + nome */}
						<div className='wcs-mobile__brand'>
							<img
								src='https://rbxsoft.com/wp-content/uploads/2023/05/cropped-RBXSoft-Padrao.png'
								alt='Logo'
								className='wcs-mobile__logo'
							/>
							<span className='wcs-mobile__company'>
								RBXSoft Company
							</span>
						</div>

						{/* Linha 2: subtítulo */}
						<p className='wcs-mobile__subtitle'>
							Siga os passos para concluir sua assinatura
						</p>

						{/* Linha 3: título da etapa atual */}
						<h2 className='wcs-mobile__step-title'>
							{currentStepLabel}
						</h2>

						{/* Linha 4: dots colapsados + botão toggle */}
						{!stepsExpanded && (
							<>
								<div className='wcs-mobile__collapsed-row'>
									<div className='wcs-mobile__dots'>
										{orderedSteps.map((s, index) => {
											const isCompleted =
												index < currentStep
											const isActive =
												index === currentStep
											return (
												<Fragment key={s}>
													<span
														className={[
															'wcs-mobile__dot',
															isCompleted
																? 'wcs-mobile__dot--completed'
																: '',
															isActive
																? 'wcs-mobile__dot--active'
																: '',
														]
															.filter(Boolean)
															.join(' ')}
													/>
													{index <
														orderedSteps.length -
															1 && (
														<span
															className={`wcs-mobile__dot-line${isCompleted ? ' wcs-mobile__dot-line--completed' : ''}`}
														/>
													)}
												</Fragment>
											)
										})}
									</div>
								</div>
								<button
									type='button'
									className='wcs-mobile__toggle'
									onClick={() => setExpandedStep(step)}
									aria-label='Expandir etapas'
								>
									<Icon
										path={mdiChevronDown}
										size={0.9}
									/>
								</button>
							</>
						)}

						{/* Painel expandido: lista de steps + botão para fechar */}
						{stepsExpanded && (
							<div className='wcs-mobile__expanded'>
								<ol className='wcs-mobile__list'>
									{availableSteps.map((s, index) => {
										const isCompleted = index < currentStep
										const isActive = index === currentStep
										return (
											<li
												key={s}
												className={[
													'wcs-mobile__list-item',
													isCompleted
														? 'wcs-mobile__list-item--completed'
														: '',
													isActive
														? 'wcs-mobile__list-item--active'
														: '',
												]
													.filter(Boolean)
													.join(' ')}
											>
												<span className='wcs-mobile__list-marker'>
													{isCompleted && (
														<span className='wcs-mobile__list-check'>
															<Icon
																path={mdiCheck}
																size={0.65}
															/>
														</span>
													)}
													{isActive && (
														<span className='wcs-mobile__list-active-dots'>
															<span />
															<span />
															<span />
														</span>
													)}
												</span>
												<span className='wcs-mobile__list-label'>
													{flowSteps.find(
														(f) => f.key === s,
													)?.label ?? s}
												</span>
											</li>
										)
									})}
								</ol>

								<div className='wcs-mobile__expanded-footer'>
									<button
										type='button'
										className='wcs-mobile__toggle'
										onClick={() => setExpandedStep(null)}
										aria-label='Recolher etapas'
									>
										<Icon
											path={mdiChevronUp}
											size={0.9}
										/>
									</button>
								</div>
							</div>
						)}
					</div>

					{/* ════════════════════════════════════
					    DESKTOP: sidebar original (inalterado)
					    ════════════════════════════════════ */}
					<div className='wcs-desktop'>
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
							{availableSteps.map((s, index) => {
								const isCompleted = index < currentStep
								const isActive = index === currentStep
								return (
									<li
										key={s}
										className={`wizard-check-steps__item ${
											isCompleted
												? 'wizard-check-steps__item--completed'
												: ''
										} ${isActive ? 'wizard-check-steps__item--active' : ''}`}
									>
										<span className='wizard-check-steps__marker'>
											{isCompleted && (
												<span className='wizard-check-steps__marker-check'>
													<Icon
														path={mdiCheck}
														size={0.7}
													/>
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
											{flowSteps.find((f) => f.key === s)
												?.label ?? s}
										</span>
									</li>
								)
							})}
						</ol>
					</div>

					{/* Confirmação: footer fixo no mobile, inline no desktop */}
					{step === 'read' && (
						<div className='wizard-check-steps__confirmation'>
							<Input.Root>
								<FormCheckbox
									name='fileReadingConfirmed'
									control={control}
									label='Declaro que li e estou de acordo com o conteúdo do documento.'
									errorMessage={
										errors.fileReadingConfirmed?.message
									}
								/>
							</Input.Root>
							<div className='wizard-check-steps__nav-row'>
								<div className='wizard-check-steps__nav-back'>
									{onBack && (
										<Button
											Label='Voltar'
											type='secondary'
											onClick={onBack}
										/>
									)}
								</div>
								<span className='wizard-check-steps__nav-counter'>
									Etapa {currentStep + 1} de{' '}
									{orderedSteps.length}
								</span>
								{onNext && (
									<Button
										Label='Começar'
										type='primary'
										onClick={onNext}
										disabled={
											watch('fileReadingConfirmed') !==
											true
										}
									/>
								)}
							</div>
						</div>
					)}
				</section>
			</div>
		</aside>
	)
}
