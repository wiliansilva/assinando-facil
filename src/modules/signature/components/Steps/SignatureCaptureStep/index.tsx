import { mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import SignatureCapture from '../../../../../components/SignatureCapture'
import SignatureGenerator from '../../../../../components/SignatureGenerator'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import type { SignatureData, SignatureType } from '../../../../../domain/types'
import { useSignatureStore } from '../../../store/signature.store'
import './style.css'

export default function SignatureCaptureStep() {
	const { register, setValue, control } =
		useFormContext<Partial<SignatureData>>()

	const signatureBase64 = useWatch({
		control,
		name: 'signatureBase64',
	})

	const setStepValid = useSignatureStore((state) => state.setStepValid)
	const updateData = useSignatureStore((state) => state.updateData)
	const currentData = useSignatureStore((state) => state.data)

	const [activeTab, setActiveTab] = useState<SignatureType>(
		currentData.signatureType || 'typed',
	)

	useEffect(() => {
		setStepValid('signature', !!signatureBase64)
	}, [signatureBase64, setStepValid])

	const handleTabChange = (tab: SignatureType) => {
		setActiveTab(tab)
		updateData({ signatureType: tab })
		// Limpa a assinatura ao trocar de aba
		setValue('signatureBase64', '', { shouldValidate: false })
	}

	return (
		<div className='photo-document-step'>
			<Text
				type={TextType.title}
				value='Você pode desenhar sua assinatura ou gerar automaticamente a partir do seu nome.'
			/>

			<div className='photo-document-step__title'>
				<Text
					type={TextType.subTitle}
					value='A assinatura digital possui validade jurídica.'
					icon={
						<Icon
							path={mdiCheck}
							size={1}
							color='var(--secondary-color-green)'
						/>
					}
				/>
			</div>

			{/* Abas */}
			<div className='signature-tabs'>
				<button
					type='button'
					className={`signature-tabs__tab ${activeTab === 'drawed' ? 'signature-tabs__tab--active' : ''}`}
					onClick={() => handleTabChange('drawed')}
				>
					DESENHAR
				</button>
				<button
					type='button'
					className={`signature-tabs__tab ${activeTab === 'typed' ? 'signature-tabs__tab--active' : ''}`}
					onClick={() => handleTabChange('typed')}
				>
					DIGITAR
				</button>
			</div>

			{/* Conteúdo da aba */}
			{activeTab === 'typed' && (
				<SignatureGenerator
					initialValue={currentData.fullName}
					onConfirm={(base64) => {
						setValue('signatureBase64', base64 ?? '', {
							shouldValidate: true,
						})
					}}
				/>
			)}
			{activeTab === 'drawed' && (
				<SignatureCapture
					key={activeTab}
					initialValue={signatureBase64}
					onConfirm={(base64) => {
						setValue('signatureBase64', base64 ?? '', {
							shouldValidate: true,
						})
					}}
				/>
			)}

			<input
				type='hidden'
				{...register('signatureBase64')}
			/>
		</div>
	)
}
