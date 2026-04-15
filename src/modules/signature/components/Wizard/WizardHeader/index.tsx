import Button from '../../../../../components/Button'
import { useSignatureStore } from '../../../store/signature.store'
import type { WizardHeaderProps } from '../types'
import './style.css'

export function WizardHeader({
	title,
	stepNumber,
	totalSteps,
	onDownload,
	onBack,
	onNext,
	disableNext,
}: WizardHeaderProps) {
	const showProgress =
		typeof stepNumber === 'number' &&
		typeof totalSteps === 'number' &&
		totalSteps > 0

	const percent = showProgress
		? Math.max(
				0,
				Math.min(100, Math.round((stepNumber! / totalSteps!) * 100)),
			)
		: 0

	const isValid = useSignatureStore((s) => s.isCurrentStepValid())

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
							Etapa {stepNumber} de {totalSteps}
						</p>
					)}
				</div>

				<div className='wizard-header-right'>
					{onNext && (
						<Button
							Label='Avançar'
							type='primary'
							onClick={onNext}
							disabled={!isValid || disableNext}
						/>
					)}
				</div>
			</div>

			{showProgress && (
				<div className='wizard-progress'>
					<div
						className='wizard-progress-bar'
						style={{ width: `${percent}%` }}
					/>
				</div>
			)}
		</header>
	)
}
