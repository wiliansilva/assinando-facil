import { mdiAlertCircle, mdiCamera, mdiCheck, mdiCheckCircle } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import recognitionePlaceholder from '../../../../../assets/recognition-placeholder.png'

import Button from '../../../../../components/Button'
import { FaceMeshCapture } from '../../../../../components/FaceMeshCapture'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import type { SignatureData } from '../../../../../domain/types'
import { useSignatureStore } from '../../../store/signature.store'

const CHECKLIST_ITEMS = [
	'Mantenha o rosto iluminado e sem óculos escuros.',
	'Olhe diretamente para a câmera.',
	'Mantenha o rosto dentro da guia oval.',
]

export default function RecognitionStep() {
	const {
		control,
		setValue,
		formState: { errors },
	} = useFormContext<Partial<SignatureData>>()
	const hasError = !!errors.recognitionBase64

	const [cameraOpen, setCameraOpen] = useState(false)

	const recognitionBase64 = useWatch({ control, name: 'recognitionBase64' })
	const setStepValid = useSignatureStore((state) => state.setStepValid)

	useEffect(() => {
		setStepValid('recognition', !!recognitionBase64)
	}, [recognitionBase64, setStepValid])

	function handleConfirm(base64: string) {
		setValue('recognitionBase64', base64, { shouldValidate: true })
		setCameraOpen(false)
	}

	return (
		<div className='content-step'>
			<Text
				type={TextType.title}
				value='Vamos verificar sua identidade com reconhecimento facial com base na foto do seu documento.'
			/>

			<div className='content-step__title'>
				<Text
					type={TextType.title}
					value='Antes de tirar a foto verifique:'
				/>
				{CHECKLIST_ITEMS.map((item) => (
					<Text
						key={item}
						type={TextType.subTitle}
						value={item}
						icon={
							<Icon
								path={mdiCheck}
								size={1}
								color='var(--secondary-color-green)'
							/>
						}
					/>
				))}
			</div>

			<div className='content-step__fields'>
				<div className='photo-document__take'>
					<div className='photo-document__take-image'>
						{recognitionBase64 ? (
							<>
								<img
									src={recognitionBase64}
									className='success'
									loading='lazy'
									alt='Reconhecimento facial capturado'
								/>
								<div className='photo-document__take-message success'>
									<Icon
										path={mdiCheckCircle}
										size={1}
										color='var(--secondary-color-green)'
									/>
									<span>Foto capturada com sucesso</span>
								</div>
							</>
						) : (
							<>
								<img
									src={recognitionePlaceholder}
									loading='lazy'
									alt='Placeholder reconhecimento facial'
								/>
								{hasError && (
									<div className='photo-document__take-message error'>
										<Icon
											path={mdiAlertCircle}
											size={1}
											color='var(--text-color-red)'
										/>
										<span>
											Capture seu rosto para continuar
										</span>
									</div>
								)}
							</>
						)}
					</div>

					<Button
						type='secondary'
						Label='INICIAR RECONHECIMENTO'
						icon={
							<Icon
								path={mdiCamera}
								size={1}
							/>
						}
						onClick={() => setCameraOpen(true)}
					/>
				</div>
			</div>

			{cameraOpen && (
				<FaceMeshCapture
					title='Reconhecimento facial'
					onClose={() => setCameraOpen(false)}
					onConfirm={handleConfirm}
				/>
			)}
		</div>
	)
}
