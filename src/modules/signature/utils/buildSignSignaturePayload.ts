import type { SignatureData, SignSignaturePayload } from '../../../domain/types'
import { brToISO } from '../../../utils/dates'

function cleanBase64(input: string): string {
	let base64 = extractBase64(input)

	base64 = base64.replace(/\s/g, '')
	base64 = base64.replace(/-/g, '+').replace(/_/g, '/')

	const padding = base64.length % 4
	if (padding) {
		base64 += '='.repeat(4 - padding)
	}

	return base64
}
function extractBase64(data: string): string {
	if (!data) return data

	const match = data.match(/^data:(.+);base64,(.*)$/)

	if (match) {
		return match[2] // só o base64
	}

	return data // já é base64 puro
}

export function buildSignSignaturePayload(
	data: Partial<SignatureData>,
): SignSignaturePayload {
	return {
		token: data.token || '',
		signatario: {
			documento: data.cpf || '',
			nascimento: data.dateOfBirth ? brToISO(data.dateOfBirth) : '',
		},
		latitude: data.latitude || '',
		longitude: data.longitude || '',
		autenticacao_manuscrito_base64: cleanBase64(data.signatureBase64 || ''),
		autenticacao_selfie_base64: cleanBase64(data.selfieBase64 || ''),
		autenticacao_foto_frente_base64: cleanBase64(
			data.documentFrontBase64 || '',
		),
		autenticacao_foto_verso_base64: cleanBase64(
			data.documentBackBase64 || '',
		),
	}
}
