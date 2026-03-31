import { mdiCheckCircle } from '@mdi/js'
import Icon from '@mdi/react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import Button from '../../../../../components/Button'
import { CameraCapture } from '../../../../../components/CameraCapture'
import type { SignatureData } from '../../../store/types'

type DocumentPhotoFieldProps = {
	label: string
	fieldName: keyof Pick<
		SignatureData,
		'documentFrontBase64' | 'documentBackBase64'
	>
	placeholderSrc: string
	cameraTitle: string
}

export function DocumentPhotoField({
	label,
	fieldName,
	placeholderSrc,
	cameraTitle,
}: DocumentPhotoFieldProps) {
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
	}

	return (
		<div className='photo-document__take'>
			<div className='photo-document__take-image'>
				<span className='input-text__label'>
					{label}
					<span className='input-text__required'>*</span>
				</span>

				<input
					type='hidden'
					{...register(fieldName)}
				/>

				{capturedImage ? (
					<>
						<img
							src={capturedImage}
							className={hasError ? 'error' : 'success'}
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
						<img src={placeholderSrc} />
						{hasError && (
							<div className='photo-document__take-message error'>
								<Icon
									path={mdiCheckCircle}
									size={1}
									color='var(--text-color-red)'
								/>
								<span>Selecione uma foto válida</span>
							</div>
						)}
					</>
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
				type='primary'
				Label='TIRAR FOTO'
				onClick={() => setCameraOpen(true)}
			/>
		</div>
	)
}
