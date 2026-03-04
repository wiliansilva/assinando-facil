import { useState } from 'react'
import { WizardLayout } from '../components/WizardLayout'
import { useSignatureStore } from '../store/signature.store'

export function ConfirmDataStep() {
	const { data, updateData, setStep } = useSignatureStore()
	const [valid, setValid] = useState(false)

	const handleChange = (field: string, value: string) => {
		updateData({ [field]: value })
	}

	const validate = () => {
		const isValid =
			data.fullName.length > 3 &&
			data.cpf.length > 10 &&
			data.email.includes('@')
		setValid(isValid)
	}

	return (
		<WizardLayout
			title='Confirme seus dados'
			onNext={() => setStep('document')}
			onBack={() => setStep('read')}
			disableNext={!valid}
		>
			<p>Estes dados serão vinculados ao documento assinado.</p>

			<input
				placeholder='Nome completo'
				value={data.fullName}
				onChange={(e) => {
					handleChange('fullName', e.target.value)
					validate()
				}}
			/>

			<input
				placeholder='CPF'
				value={data.cpf}
				onChange={(e) => {
					handleChange('cpf', e.target.value)
					validate()
				}}
			/>

			<input
				placeholder='E-mail'
				value={data.email}
				onChange={(e) => {
					handleChange('email', e.target.value)
					validate()
				}}
			/>
		</WizardLayout>
	)
}
