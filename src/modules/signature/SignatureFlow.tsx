import { PlaceholderStep } from './steps/PlaceholderStep'
import { ReadDocumentStep } from './steps/ReadDocumentStep'
import { useSignatureStore } from './store/signature.store'

export function SignatureFlow() {
	const step = useSignatureStore((s) => s.step)

	switch (step) {
		case 'read':
			return <PlaceholderStep stepKey='read' />

		case 'confirm':
			return <PlaceholderStep stepKey='confirm' />

		case 'document':
			return <PlaceholderStep stepKey='document' />

		case 'selfie':
			return <PlaceholderStep stepKey='selfie' />

		case 'signature':
			return <PlaceholderStep stepKey='signature' />

		case 'token':
			return <PlaceholderStep stepKey='token' />

		default:
			return <ReadDocumentStep />
	}
}
