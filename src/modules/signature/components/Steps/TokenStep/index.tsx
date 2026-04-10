import { mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { TokenInput } from '../../../../../components/Input/variations/input/InputToken'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import type { SignatureData } from '../../../../../domain/types'
import { useSignatureStore } from '../../../store/signature.store'
import './style.css'

export default function TokenStep() {
	const {
		control,
		setValue,
		formState: { errors },
		register,
	} = useFormContext<Partial<SignatureData>>()

	const token = useWatch({
		control,
		name: 'token',
	})

	const setStepValid = useSignatureStore((state) => state.setStepValid)
	const updateData = useSignatureStore((state) => state.updateData)
	const [tokenInput, setTokenInput] = useState(token)

	useEffect(() => {
		setValue('token', tokenInput)
		updateData({ token: tokenInput })
		setStepValid('token', !!token && token.trim().length >= 6)
	}, [token, setStepValid, updateData, setValue, tokenInput])

	return (
		<div className='token-step'>
			<div className='token-step__title'>
				<Text
					type={TextType.title}
					value='Digite o Token enviado para seu email.'
				/>

				<Text
					type={TextType.subTitle}
					value='Este código é necessário para validar e confirmar sua assinatura no documento.'
					icon={
						<Icon
							path={mdiCheck}
							size={1}
							color={'var(--secondary-color-green)'}
						/>
					}
				/>
			</div>

			<div className='token-step__fields'>
				<TokenInput
					length={6}
					value={tokenInput || ''}
					onChange={setTokenInput}
					errors={errors.token ? errors.token.message : ''}
				/>
				<input
					type='hidden'
					{...register('token')}
				/>
			</div>
		</div>
	)
}
