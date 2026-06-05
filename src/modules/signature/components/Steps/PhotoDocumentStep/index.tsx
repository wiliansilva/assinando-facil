import { mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import documentBackPlaceholder from '../../../../../assets/document-back-placeholder.webp'
import documentFrontPlaceholder from '../../../../../assets/document-front-placeholder.webp'

import LoadingValidation from '../../../../../components/LoadingValidation'
import { PhotoCaptureField } from '../../../../../components/PhotoCaptureField'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import type { SignatureData } from '../../../../../domain/types'
import { formatErrorMessage } from '../../../../../services/errorHandler'
import type { ApiError } from '../../../../../services/types'
import { useValidateDocument } from '../../../hooks/useValidateDocument'
import { useSignatureStore } from '../../../store/signature.store'

const CHECKLIST_ITEMS = [
	'Documento inteiro na imagem',
	'Sem reflexos',
	'Texto legível',
	'Envie um documento com foto e CPF',
]

export default function PhotoDocumentStep() {
	const { control, setError } = useFormContext<Partial<SignatureData>>()

	const documentFrontBase64 = useWatch({
		control,
		name: 'documentFrontBase64',
	})
	const documentBackBase64 = useWatch({ control, name: 'documentBackBase64' })

	const setStepValid = useSignatureStore((state) => state.setStepValid)
	const updateData = useSignatureStore((state) => state.updateData)
	const isValid = useSignatureStore((s) => s.isCurrentStepValid())
	const { validate, isValidating } = useValidateDocument()

	const [isDocumentBackBase64Valid, setIsDocumentBackBase64Valid] =
		useState(false)
	const [isDocumentFrontBase64Valid, setIsDocumentFrontBase64Valid] =
		useState(false)

	useEffect(() => {
		if (isValid) {
			return
		}
		if (!documentFrontBase64 || !documentBackBase64) {
			setStepValid('document', false)
			return
		}

		updateData({ documentFrontBase64, documentBackBase64 })
		setStepValid('document', false)
		validate(documentFrontBase64, documentBackBase64)
			.then((ok) => {
				setStepValid('document', ok)
				setIsDocumentFrontBase64Valid(ok)
				setIsDocumentBackBase64Valid(ok)
			})
			.catch((error: ApiError) => {
				const errorMessage = formatErrorMessage(error)
				const isBack = errorMessage.toLowerCase().includes('verso')
				if (isBack) {
					setError('documentBackBase64', {
						type: 'manual',
						message: errorMessage,
					})
					setIsDocumentBackBase64Valid(false)
					setIsDocumentFrontBase64Valid(true)
				} else {
					setError('documentFrontBase64', {
						type: 'manual',
						message: errorMessage,
					})
					setIsDocumentFrontBase64Valid(false)
					setIsDocumentBackBase64Valid(false)
				}
				setStepValid('document', false)
			})
	}, [
		documentFrontBase64,
		documentBackBase64,
		validate,
		setStepValid,
		updateData,
		setError,
		isValid,
	])

	if (isValidating) {
		return <LoadingValidation />
	}

	return (
		<div className='content-step'>
			<Text
				type={TextType.title}
				value='Envie uma foto frente e verso do seu documento (RG, CNH ou outro documento oficial).'
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
					label='Frente'
					fieldName='documentFrontBase64'
					placeholderSrc={documentFrontPlaceholder}
					cameraTitle='Frente do seu documento'
					isFieldValid={isDocumentFrontBase64Valid}
				/>
				<PhotoCaptureField
					label='Verso'
					fieldName='documentBackBase64'
					placeholderSrc={documentBackPlaceholder}
					cameraTitle='Verso do seu documento'
					isFieldValid={isDocumentBackBase64Valid}
				/>
			</div>
		</div>
	)
}
