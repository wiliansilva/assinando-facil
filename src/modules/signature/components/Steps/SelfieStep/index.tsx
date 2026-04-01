import { mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { PhotoCaptureField } from '../../../../../components/PhotoCaptureField'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import type { SignatureData } from '../../../../../domain/types'
import { useSignatureStore } from '../../../store/signature.store'
const CHECKLIST_ITEMS = [
	'Na foto, mantenha o documento visível e não cubra o rosto.',
	'A foto é usada apenas para validar sua identidade e não será compartilhada.',
]
export default function SelfieStep() {
	const { control } = useFormContext<Partial<SignatureData>>()

	const selfieBase64 = useWatch({
		control,
		name: 'selfieBase64',
	})

	const setStepValid = useSignatureStore((state) => state.setStepValid)

	useEffect(() => {
		setStepValid('selfie', !!selfieBase64)
	}, [selfieBase64, setStepValid])
	return (
		<div className='photo-document-step'>
			<Text
				type={TextType.title}
				value='Envie uma foto segurando o documento (RG, CNH ou outro documento oficial).'
			/>

			<div className='photo-document-step__title'>
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

			<div className='photo-document-step__fields'>
				<PhotoCaptureField
					label=''
					fieldName='selfieBase64'
					placeholderSrc='/assets/selfie-placeholder.png'
					cameraTitle='Selfie com o documento'
				/>
			</div>
		</div>
	)
}
