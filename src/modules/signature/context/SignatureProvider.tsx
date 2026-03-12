import { useMemo, useState } from 'react'
import { SignatureContext } from './SignatureContext'
import { type SignatureProviderProps } from './types'

export function SignatureProvider({
	children,
	defaultValid = true,
}: SignatureProviderProps) {
	const [isNextDisabled, setIsNextDisabled] = useState(!defaultValid)

	const value = useMemo(
		() => ({
			isNextDisabled,
			setDisableNext: setIsNextDisabled,
			setStepValid: (isValid: boolean) => setIsNextDisabled(!isValid),
		}),
		[isNextDisabled],
	)

	return (
		<SignatureContext.Provider value={value}>
			{children}
		</SignatureContext.Provider>
	)
}
