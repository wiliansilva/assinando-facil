import type { SignatureStep } from '../../../domain/types'

const ALL_STEPS: SignatureStep[] = [
	'read',
	'confirm',
	'document',
	'selfie',
	'recognition',
	'signature',
	'token',
]

const PERMISSION_MAPPING: Record<string, SignatureStep> = {
	autenticacao_foto: 'document',
	autenticacao_selfie: 'selfie',
	autenticacao_manuscrito: 'signature',
	autenticacao_biometria: 'recognition',
}

export function filterStepsByPermissions(
	permissions: Record<string, string | undefined> | undefined,
): SignatureStep[] {
	return ALL_STEPS.filter((step) => {
		const permissionKey = Object.entries(PERMISSION_MAPPING).find(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			([_, value]) => value === step,
		)?.[0]

		if (!permissionKey) return true // Se não tem mapeamento, inclui o step

		const permission = permissions?.[permissionKey]
		if (permission === 'sim') return true

		// autenticacao_biometria implica autenticacao_foto
		if (
			permissionKey === 'autenticacao_foto' &&
			permissions?.autenticacao_biometria === 'sim'
		)
			return true

		return false
	})
}
