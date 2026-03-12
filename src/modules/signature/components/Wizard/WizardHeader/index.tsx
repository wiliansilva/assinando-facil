import { useSignatureContext } from '../../../context/SignatureContext'
import Button from '../../Button'
import type { WizardHeaderProps } from '../types'
import './style.css'

export function WizardHeader({
	title,
	step,
	totalSteps,
	onDownload,
	onBack,
	onNext,
}: WizardHeaderProps) {
	const { isNextDisabled } = useSignatureContext()
	const showProgress =
		typeof step === 'number' &&
		typeof totalSteps === 'number' &&
		totalSteps > 0
	const percent = showProgress
		? Math.max(0, Math.min(100, Math.round((step! / totalSteps!) * 100)))
		: 0

	return (
		<header className='wizard-header'>
			<div className='wizard-header-content'>
				<div className='wizard-header-left'>
					{onDownload && (
						<Button
							Label='Baixar'
							type='secondary'
							onClick={onDownload}
						/>
					)}
					{onBack && (
						<Button
							Label='Voltar'
							type='secondary'
							onClick={onBack}
						/>
					)}
				</div>

				<div className='wizard-header-center'>
					<h1 className='wizard-title'>{title}</h1>

					{showProgress && (
						<p className='wizard-step'>
							Etapa {step} de {totalSteps}
						</p>
					)}
				</div>

				<div className='wizard-header-right'>
					{onNext && (
						<Button
							Label='Avançar'
							type='primary'
							onClick={onNext}
							disabled={isNextDisabled}
						/>
					)}
				</div>
			</div>

			{showProgress && (
				<div
					className='wizard-progress'
					aria-hidden={false}
				>
					<div
						className='wizard-progress-bar'
						style={{ width: `${percent}%` }}
					/>
				</div>
			)}
		</header>
	)
}
