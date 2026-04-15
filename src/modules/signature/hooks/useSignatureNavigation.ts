import type { SignatureStep } from '../../../domain/types'
import { useSignatureStore } from '../store/signature.store'

// hooks/useSignatureNavigation.ts
export function useSignatureNavigation(steps: SignatureStep[]) {
	const step = useSignatureStore((s) => s.step)
	const setStep = useSignatureStore((s) => s.setStep)
	const currentIndex = steps.indexOf(step)

	const goNext =
		currentIndex < steps.length - 1
			? () => setStep(steps[currentIndex + 1])
			: undefined

	const goBack =
		currentIndex > 0 ? () => setStep(steps[currentIndex - 1]) : undefined

	return { currentIndex, goNext, goBack }
}
