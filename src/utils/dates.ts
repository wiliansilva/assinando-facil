export function brToISO(value: string): string {
	const [dia, mes, ano] = value.split('/')
	if (!dia || !mes || !ano) return value
	return `${ano}-${mes}-${dia}`
}

export function isoToBR(value: string): string {
	const [ano, mes, dia] = value.split('-')
	if (!dia || !mes || !ano) return value
	return `${dia}/${mes}/${ano}`
}

export function isValidDateBR(value: string) {
	const [dia, mes, ano] = value.split('/').map(Number)

	if (!dia || !mes || !ano) return false

	const data = new Date(ano, mes - 1, dia)

	return (
		data.getFullYear() === ano &&
		data.getMonth() === mes - 1 &&
		data.getDate() === dia
	)
}
