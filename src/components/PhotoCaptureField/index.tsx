import { mdiAlertCircle, mdiCamera, mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { SignatureData } from '../../domain/types'
import { useSignatureStore } from '../../modules/signature/store/signature.store'
import Button from '../Button'
import { CameraCapture } from '../CameraCapture'
import './style.css'
import type { PhotoCaptureFieldProps } from './types'

export function PhotoCaptureField({
	label,
	fieldName,
	placeholderSrc,
	cameraTitle,
	isFieldValid = true,
}: PhotoCaptureFieldProps) {
	const setStepValid = useSignatureStore((state) => state.setStepValid)
	const step = useSignatureStore((s) => s.step)
	const [cameraOpen, setCameraOpen] = useState(false)

	const {
		register,
		setValue,
		watch,
		formState: { errors },
	} = useFormContext<Partial<SignatureData>>()

	const capturedImage = watch(fieldName)
	const hasError = !!errors[fieldName]

	function handleConfirm(base64: string) {
		setValue(fieldName, base64, { shouldValidate: true })
		setCameraOpen(false)
		setStepValid(step, false)
	}

	return (
		<div className='photo-document__take'>
			<div className='photo-document__take-image'>
				{label && (
					<span className='input-text__label'>
						{label}
						<span className='input-text__required'>*</span>
					</span>
				)}

				<input
					type='hidden'
					{...register(fieldName)}
				/>

				<img
					src={capturedImage || placeholderSrc}
					loading='lazy'
					alt={capturedImage ? 'Foto capturada' : 'Foto placeholder'}
				/>
				{hasError && (
					<div className='photo-document__take-message error'>
						<Icon
							path={mdiAlertCircle}
							size={1}
							color='var(--text-color-red)'
						/>
						<span>
							{errors[fieldName]?.message ??
								'Selecione uma foto válida'}
						</span>
					</div>
				)}
				{!hasError && capturedImage && isFieldValid && (
					<div className='photo-document__take-message success'>
						<Icon
							path={mdiCheck}
							size={1}
							color='var(--secondary-color-green)'
						/>
						<span>Foto validada com sucesso!</span>
					</div>
				)}

				{cameraOpen && (
					<CameraCapture
						title={cameraTitle}
						onClose={() => setCameraOpen(false)}
						onConfirm={handleConfirm}
					/>
				)}
			</div>

			<Button
				type='secondary'
				Label='TIRAR FOTO'
				icon={
					<Icon
						path={mdiCamera}
						size={1}
					/>
				}
				onClick={() => setCameraOpen(true)}
			/>
		</div>
	)
}
