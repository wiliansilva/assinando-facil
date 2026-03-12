import type { ReactNode } from 'react'

export type SignatureContextProps = {
	isNextDisabled: boolean
	setDisableNext: (value: boolean) => void
	setStepValid: (value: boolean) => void
}

export type SignatureProviderProps = {
	children: ReactNode
	defaultValid?: boolean
}
