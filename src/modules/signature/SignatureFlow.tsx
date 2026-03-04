import { ConfirmDataStep } from './steps/ConfirmDataStep'
import { ReadDocumentStep } from './steps/ReadDocumentStep'
import { useSignatureStore } from './store/signature.store'

export function SignatureFlow() {
	const step = useSignatureStore((s) => s.step)

	switch (step) {
		case 'read':
			return <ReadDocumentStep />

		case 'confirm':
			return <ConfirmDataStep />

		default:
			return <ReadDocumentStep />
	}
}
