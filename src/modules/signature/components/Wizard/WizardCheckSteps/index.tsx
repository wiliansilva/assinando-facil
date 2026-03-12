import './style.css'

const defaultSteps = [
	'Leia o documento com atenção',
	'Confirme seus dados',
	'Foto do documento oficial',
	'Selfie com o documento',
	'Assinatura Manuscrita',
	'Token de autenticação',
]

type WizardCheckStepsProps = {
	title?: string
	description?: string
	steps?: string[]
	currentStep?: number
}

export function WizardCheckSteps({
	title = 'Vamos assinar!',
	description = 'Siga os passos para concluir sua assinatura',
	steps = defaultSteps,
	currentStep = 0,
}: WizardCheckStepsProps) {
	return (
		<section className='wizard-check-steps'>
			<div className='wizard-check-steps__brand'>
				<div
					aria-hidden='true'
					className='wizard-check-steps__logo'
				>
					<img src='https://rbxsoft.com/wp-content/uploads/2023/05/cropped-RBXSoft-Padrao.png' />
				</div>
				<p className='wizard-check-steps__company'>RBXSoft Company</p>
			</div>

			<div className='wizard-check-steps__intro'>
				<h1>{title}</h1>
				<p>{description}</p>
			</div>

			<ol className='wizard-check-steps__timeline'>
				{steps.map((step, index) => {
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
								{step}
							</span>
						</li>
					)
				})}
			</ol>
		</section>
	)
}
