import { mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { PhotoCaptureField } from '../../../../../components/PhotoCaptureField'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import type { SignatureData } from '../../../../../domain/types'
import { useSignatureStore } from '../../../store/signature.store'
import './style.css'

const CHECKLIST_ITEMS = [
	'Documento inteiro na imagem',
	'Sem reflexos',
	'Texto legível',
]

export default function PhotoDocumentStep() {
	const { control } = useFormContext<Partial<SignatureData>>()

	const documentFrontBase64 = useWatch({
		control,
		name: 'documentFrontBase64',
	})
	const documentBackBase64 = useWatch({ control, name: 'documentBackBase64' })

	const setStepValid = useSignatureStore((state) => state.setStepValid)

	useEffect(() => {
		setStepValid('document', !!documentFrontBase64 && !!documentBackBase64)
	}, [documentFrontBase64, documentBackBase64, setStepValid])

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
					placeholderSrc='/assets/document-front-placeholder.png'
					cameraTitle='Frente do seu documento'
				/>
				<PhotoCaptureField
					label='Verso'
					fieldName='documentBackBase64'
					placeholderSrc='/assets/document-back-placeholder.png'
					cameraTitle='Verso do seu documento'
				/>
			</div>
		</div>
	)
}
