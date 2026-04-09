import PdfViewer from '../../../../../components/PdfViewer'
import { useSignatureStore } from '../../../store/signature.store'

export function ReadDocumentStep() {
	const data = useSignatureStore((state) => state.data)
	return (
		<>
			<PdfViewer file={data.documentPDFUrl ? data.documentPDFUrl : ''} />
		</>
	)
}
