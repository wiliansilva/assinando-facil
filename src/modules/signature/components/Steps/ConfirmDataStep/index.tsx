import {
	mdiAccountCircle,
	mdiCakeVariant,
	mdiCardAccountDetailsOutline,
	mdiCheck,
} from '@mdi/js'
import Icon from '@mdi/react'
import { useFormContext, useWatch } from 'react-hook-form'

import { Form } from '../../../../../components/Input'
import Text from '../../../../../components/Text'
import { TextType } from '../../../../../components/Text/types'

import { useEffect } from 'react'
import { FormCheckbox } from '../../../../../components/Input/variations/form/FormCheckbox'
import type { SignatureData } from '../../../../../domain/types'
import { useSignatureStore } from '../../../store/signature.store'
import './style.css'

export function ConfirmDataStep() {
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<Partial<SignatureData>>()

	const personalDataConfirmed = useWatch({
		control,
		name: 'personalDataConfirmed',
	})

	const setStepValid = useSignatureStore((state) => state.setStepValid)
	useEffect(() => {
		setStepValid('confirm', personalDataConfirmed ?? false)
	}, [personalDataConfirmed, setStepValid])

	return (
		<div className='confirm-data-step'>
			<div className='confirm-data-step__title'>
				<Text
					type={TextType.title}
					value='Confirme seus dados para continuar com a assinatura deste documento.'
				/>

				<Text
					type={TextType.subTitle}
					value='Esses dados serão usados na assinatura do documento.'
					icon={
						<Icon
							path={mdiCheck}
							size={1}
							color={'var(--secondary-color-green)'}
						/>
					}
				/>
			</div>

			<div className='confirm-data-step__fields'>
				<Form.Text
					control={control}
					label='Nome'
					placeholder='Nome completo'
					errorMessage={errors.fullName?.message}
					required
					disabled
					{...register('fullName')}
					icon={
						<Icon
							path={mdiAccountCircle}
							size={1}
						/>
					}
				/>

				<Form.Mask
					control={control}
					label='CPF'
					placeholder='000.000.000-00'
					mask='000.000.000-00'
					errorMessage={errors.cpf?.message}
					required
					disabled
					{...register('cpf')}
					icon={
						<Icon
							path={mdiCardAccountDetailsOutline}
							size={1}
						/>
					}
				/>

				<Form.Mask
					control={control}
					label='Data de Nascimento'
					placeholder='00/00/0000'
					mask='00/00/0000'
					errorMessage={errors.dateOfBirth?.message}
					required
					{...register('dateOfBirth')}
					icon={
						<Icon
							path={mdiCakeVariant}
							size={1}
						/>
					}
				/>

				<FormCheckbox
					name='personalDataConfirmed'
					control={control}
					label='Declaro que meus dados estão corretos.'
				/>
			</div>
		</div>
	)
}
