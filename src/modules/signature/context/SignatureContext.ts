import { createContext, useContext } from 'react'
import type { SignatureContextProps } from './types'

export const SignatureContext = createContext<
	SignatureContextProps | undefined
>(undefined)

export const useSignatureContext = () => {
	const context = useContext(SignatureContext)
	if (!context) {
		throw new Error(
			'useSignatureContext deve ser usado dentro de SignatureProvider',
		)
	}
	return context
}
