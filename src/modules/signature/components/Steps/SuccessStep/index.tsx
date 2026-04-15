import { useEffect } from 'react'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import { useSignatureStore } from '../../../store/signature.store'
import './style.css'

export default function SuccessStep() {
	const reset = useSignatureStore((s) => s.reset)
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
						<img src='https://rbxsoft.com/wp-content/uploads/2023/05/cropped-RBXSoft-Padrao.png' />
					</div>
					<p className='wizard-check-steps__company'>
						RBXSoft Company
					</p>
				</div>

				<Text
					type={TextType.title}
					value='Pronto! Todos passos foram concluídos! 🎉'
				/>
				<ol className='wizard-check-steps__timeline'>
					<li className='wizard-check-steps__item wizard-check-steps__item--completed '>
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
							Leia o documento com atenção
						</span>
					</li>
					<li className='wizard-check-steps__item wizard-check-steps__item--completed '>
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
							Confirme seus dados
						</span>
					</li>
					<li className='wizard-check-steps__item wizard-check-steps__item--completed '>
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
							Foto do documento oficial
						</span>
					</li>
					<li className='wizard-check-steps__item wizard-check-steps__item--completed '>
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
							Selfie com o documento
						</span>
					</li>
					<li className='wizard-check-steps__item wizard-check-steps__item--completed '>
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
							Assinatura Manuscrita
						</span>
					</li>
					<li className='wizard-check-steps__item wizard-check-steps__item--completed '>
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
							Token de autenticação
						</span>
					</li>
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
