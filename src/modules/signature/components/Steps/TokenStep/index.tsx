import { mdiCheck, mdiSend } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import Button from '../../../../../components/Button'
import { TokenInput } from '../../../../../components/Input/variations/input/InputToken'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'
import type { SignatureData } from '../../../../../domain/types'
import { useToken } from '../../../hooks/useToken'
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
	const { resendToken } = useToken()

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

				<Button
					type='secondary'
					Label='Reenviar token'
					onClick={() => resendToken()}
					icon={
						<Icon
							path={mdiSend}
							size={1}
						/>
					}
				/>
				<Text
					type={TextType.subTitle}
					value={
						<>
							Ao finalizar, você aceita nossos{' '}
							<a
								href='/termos-de-uso'
								target='_blank'
								rel='noopener noreferrer'
							>
								Termos de Uso
							</a>{' '}
							e{' '}
							<a
								href='/politica-de-privacidade'
								target='_blank'
								rel='noopener noreferrer'
							>
								Política de Privacidade
							</a>
							.
						</>
					}
				/>
			</div>
		</div>
	)
}
