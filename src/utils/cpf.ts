export function isValidCPF(value: string): boolean {
	const cpf = value.replace(/\D/g, '')

	if (cpf.length !== 11) return false

	// Rejeita sequências repetidas (000.000.000-00, 111.111.111-11, etc.)
	if (/^(\d)\1{10}$/.test(cpf)) return false

	const calcCheckDigit = (length: number): number => {
		let sum = 0
		for (let i = 0; i < length; i++) {
			sum += Number(cpf[i]) * (length + 1 - i)
		}
		const rest = (sum * 10) % 11
		return rest === 10 ? 0 : rest
	}

	return (
		calcCheckDigit(9) === Number(cpf[9]) &&
		calcCheckDigit(10) === Number(cpf[10])
	)
}
