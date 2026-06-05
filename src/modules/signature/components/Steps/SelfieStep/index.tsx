import { mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import selfiePlaceholder from '../../../../../assets/selfie-placeholder.webp'
import LoadingValidation from '../../../../../components/LoadingValidation'
import { PhotoCaptureField } from '../../../../../components/PhotoCaptureField'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import type { SignatureData } from '../../../../../domain/types'
import { formatErrorMessage } from '../../../../../services/errorHandler'
import type { ApiError } from '../../../../../services/types'
import { useValidateSelfieDocumento } from '../../../hooks/useValidateSelfieDocumento'
import { useSignatureStore } from '../../../store/signature.store'

const CHECKLIST_ITEMS = [
	'Na foto, mantenha o documento visível e não cubra o rosto.',
	'A foto é usada apenas para validar sua identidade e não será compartilhada.',
]

export default function SelfieStep() {
	const { control, setError } = useFormContext<Partial<SignatureData>>()

	const selfieBase64 = useWatch({
		control,
		name: 'selfieBase64',
	})

	const setStepValid = useSignatureStore((state) => state.setStepValid)
	const updateData = useSignatureStore((state) => state.updateData)
	const isValid = useSignatureStore((s) => s.isCurrentStepValid())
	const { validate, isValidating } = useValidateSelfieDocumento()

	const [isSelfieValid, setIsSelfieValid] = useState(false)

	useEffect(() => {
		if (isValid) {
			return
		}
		if (!selfieBase64) {
			setStepValid('selfie', false)
			return
		}

		updateData({ selfieBase64 })
		validate(selfieBase64)
			.then((ok) => {
				setStepValid('selfie', ok)
				setIsSelfieValid(ok)
			})
			.catch((error: ApiError) => {
				const errorMessage = formatErrorMessage(error)
				setError('selfieBase64', {
					type: 'manual',
					message: errorMessage,
				})
				setStepValid('selfie', false)
			})
	}, [selfieBase64, isValid, validate, setStepValid, updateData, setError])

	if (isValidating) {
		return <LoadingValidation message='Validando Selfie...' />
	}

	return (
		<div className='content-step'>
			<Text
				type={TextType.title}
				value='Envie uma foto segurando o documento (RG, CNH ou outro documento oficial).'
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
				<PhotoCaptureField
					label=''
					fieldName='selfieBase64'
					placeholderSrc={selfiePlaceholder}
					cameraTitle='Selfie com o documento'
					isFieldValid={isSelfieValid}
				/>
			</div>
		</div>
	)
}
