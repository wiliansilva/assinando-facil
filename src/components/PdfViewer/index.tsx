import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import './style.css'

pdfjs.GlobalWorkerOptions.workerSrc = `${pdfWorker}?v=${pdfjs.version}`

const MAX_PAGE_WIDTH = 920

export default function PdfViewer({ file }: { file: string }) {
	const [numPages, setNumPages] = useState(0)
	const [containerWidth, setContainerWidth] = useState<number>()
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const container = containerRef.current

		if (!container) {
			return undefined
		}

		const updateWidth = (width: number) => {
			setContainerWidth(Math.floor(width))
		}

		updateWidth(container.clientWidth)

		const resizeObserver = new ResizeObserver(([entry]) => {
			if (!entry) {
				return
			}

			updateWidth(entry.contentRect.width)
		})

		resizeObserver.observe(container)

		return () => resizeObserver.disconnect()
	}, [])

	const pageWidth = containerWidth
		? Math.min(containerWidth, MAX_PAGE_WIDTH)
		: MAX_PAGE_WIDTH

	return (
		<div
			ref={containerRef}
			className='pdf-viewer'
		>
			<Document
				file={file}
				onLoadSuccess={({ numPages }) => setNumPages(numPages)}
				className='pdf-viewer__document'
			>
				{Array.from({ length: numPages }, (_, index) => (
					<Page
						key={index}
						pageNumber={index + 1}
						width={pageWidth}
						className='pdf-viewer__page'
						renderAnnotationLayer
						renderTextLayer
					/>
				))}
			</Document>
		</div>
	)
}
