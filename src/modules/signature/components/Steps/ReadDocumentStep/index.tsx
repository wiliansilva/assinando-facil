import { mdiDownload } from '@mdi/js'
import Icon from '@mdi/react'
import Button from '../../../../../components/Button'
import PdfViewer from '../../../../../components/PdfViewer'
import { useSignatureStore } from '../../../store/signature.store'

export function ReadDocumentStep() {
	const data = useSignatureStore((state) => state.data)

	async function handleDownload() {
		if (!data.documentPDFUrl) return
		const response = await fetch(data.documentPDFUrl)
		const blob = await response.blob()
		const objectUrl = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = objectUrl
		link.download = 'document.pdf'
		link.click()
		URL.revokeObjectURL(objectUrl)
	}

	return (
		<>
			<PdfViewer file={data.documentPDFUrl ? data.documentPDFUrl : ''} />
			<Button
				type='float'
				icon={
					<Icon
						path={mdiDownload}
						size={1}
					/>
				}
				title='Baixar Documento'
				onClick={handleDownload}
			/>
		</>
	)
}
