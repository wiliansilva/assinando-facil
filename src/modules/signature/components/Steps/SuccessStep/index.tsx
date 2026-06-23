import { useEffect } from 'react'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import type { SignatureStep } from '../../../../../domain/types'
import { useSignatureStore } from '../../../store/signature.store'
import './style.css'

const STEP_LABELS: Partial<Record<SignatureStep, string>> = {
	read: 'Leia o documento com atenção',
	confirm: 'Confirme seus dados',
	document: 'Foto do documento oficial',
	recognition: 'Reconhecimento facial',
	selfie: 'Selfie com o documento',
	signature: 'Assinatura Manuscrita',
	token: 'Token de autenticação',
}

export default function SuccessStep() {
	const reset = useSignatureStore((s) => s.reset)
	const company = useSignatureStore((s) => s.company)
	const availableSteps = useSignatureStore((s) => s.availableSteps)
	useEffect(() => {
		return () => {
			reset()
		}
	}, [reset])

	return (
		<div className='success-step'>
			<>
				<div className='wizard-check-steps__brand'>
					<div
						aria-hidden='true'
						className='wizard-check-steps__logo'
					>
						<img
							src={company?.logoUrl}
							loading='lazy'
							alt=''
						/>
					</div>
					<p className='wizard-check-steps__company'>
						{company?.name}
					</p>
				</div>

				<Text
					type={TextType.title}
					value='Pronto! Todos passos foram concluídos! 🎉'
				/>
				<ol className='wizard-check-steps__timeline'>
					{availableSteps.map((step) => (
						<li
							key={step}
							className='wizard-check-steps__item wizard-check-steps__item--completed '
						>
							<span className='wizard-check-steps__marker'>
								<span className='wizard-check-steps__marker-check'>
									<svg
										viewBox='0 0 24 24'
										role='presentation'
									>
										<path d='M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'></path>
									</svg>
								</span>
							</span>
							<span className='wizard-check-steps__label'>
								{STEP_LABELS[step] ?? step}
							</span>
						</li>
					))}
				</ol>
				<Text
					type={TextType.title}
					value='Documento assinado com sucesso!'
				/>
				<Text
					type={TextType.subTitle}
					value='Você receberá o documento assinado por e-mail.'
				/>
				<Text
					type={TextType.subTitle}
					value='Você não precisa fazer mais nada. 👍🏻'
				/>
			</>
		</div>
	)
}
