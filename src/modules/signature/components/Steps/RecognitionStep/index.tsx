import { mdiAlertCircle, mdiCamera, mdiCheck, mdiCheckCircle } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import recognitionePlaceholder from '../../../../../assets/recognition-placeholder.png'

import Button from '../../../../../components/Button'
import { FaceMeshCapture } from '../../../../../components/FaceMeshCapture'
import LoadingValidation from '../../../../../components/LoadingValidation'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import type { SignatureData } from '../../../../../domain/types'
import { formatErrorMessage } from '../../../../../services/errorHandler'
import type { ApiError } from '../../../../../services/types'
import { useValidateBiometria } from '../../../hooks/useValidateBiometria'
import { useSignatureStore } from '../../../store/signature.store'

const CHECKLIST_ITEMS = [
	'Mantenha o rosto iluminado e sem óculos escuros.',
	'Olhe diretamente para a câmera.',
	'Mantenha o rosto dentro da guia oval.',
]

export default function RecognitionStep() {
	const {
		register,
		control,
		setValue,
		setError,
		formState: { errors },
	} = useFormContext<Partial<SignatureData>>()
	const hasError = !!errors.recognitionBase64

	const [cameraOpen, setCameraOpen] = useState(false)

	const recognitionBase64 = useWatch({ control, name: 'recognitionBase64' })
	const setStepValid = useSignatureStore((state) => state.setStepValid)
	const updateData = useSignatureStore((state) => state.updateData)
	const data = useSignatureStore((state) => state.data)
	const isValid = useSignatureStore((s) => s.isCurrentStepValid())
	const { validate, isValidating } = useValidateBiometria()

	useEffect(() => {
		if (isValid) return
		if (!recognitionBase64) {
			setStepValid('recognition', false)
			return
		}

		updateData({ recognitionBase64 })
		validate(data.documentFrontBase64 ?? '', recognitionBase64)
			.then((ok) => {
				setStepValid('recognition', ok)
			})
			.catch((error: ApiError) => {
				const errorMessage = formatErrorMessage(error)
				setError('recognitionBase64', {
					type: 'manual',
					message: errorMessage,
				})
				setStepValid('recognition', false)
			})
	}, [
		recognitionBase64,
		isValid,
		validate,
		setStepValid,
		updateData,
		setError,
		data.documentFrontBase64,
	])

	function handleConfirm(base64: string) {
		setValue('recognitionBase64', base64, { shouldValidate: true })
		setCameraOpen(false)
		setStepValid('recognition', false)
	}

	if (isValidating) {
		return (
			<LoadingValidation message='Realizando reconhecimento facial...' />
		)
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
						<input
							type='hidden'
							{...register('recognitionBase64')}
						/>

						<img
							src={recognitionBase64 || recognitionePlaceholder}
							loading='lazy'
							alt='Reconhecimento facial capturado'
						/>
						{hasError && (
							<div className='photo-document__take-message error'>
								<Icon
									path={mdiAlertCircle}
									size={1}
									color='var(--text-color-red)'
								/>
								<span>
									{errors['recognitionBase64']?.message ??
										'Selecione uma foto válida'}
								</span>
							</div>
						)}

						{!hasError && recognitionBase64 && (
							<div className='photo-document__take-message success'>
								<Icon
									path={mdiCheckCircle}
									size={1}
									color='var(--secondary-color-green)'
								/>
								<span>
									Reconhecimento facial realizado com sucesso
								</span>
							</div>
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
