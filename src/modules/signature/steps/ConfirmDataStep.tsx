import { useEffect } from 'react'
import { useSignatureContext } from '../context/SignatureContext'
import { useSignatureStore } from '../store/signature.store'

export function ConfirmDataStep() {
	const { data, updateData } = useSignatureStore()
	const { setStepValid } = useSignatureContext()

	const handleChange = (field: string, value: string) => {
		updateData({ [field]: value })
	}

	useEffect(() => {
		const isValid =
			data.fullName.trim().length > 3 &&
			data.cpf.trim().length > 10 &&
			data.email.includes('@')

		setStepValid(isValid)
	}, [data.cpf, data.email, data.fullName, setStepValid])

	return (
		<>
			<p>Estes dados serão vinculados ao documento assinado.</p>

			<input
				placeholder='Nome completo'
				value={data.fullName}
				onChange={(e) => handleChange('fullName', e.target.value)}
			/>

			<input
				placeholder='CPF'
				value={data.cpf}
				onChange={(e) => handleChange('cpf', e.target.value)}
			/>

			<input
				placeholder='E-mail'
				value={data.email}
				onChange={(e) => handleChange('email', e.target.value)}
			/>
		</>
	)
}
