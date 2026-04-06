import { mdiAccountCircle } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useRef, useState } from 'react'
import { Input } from '../Input'

type SignatureGeneratorProps = {
	width?: number
	height?: number
	onConfirm?: (dataUrl: string | null) => void
	initialValue?: string | null
}

export default function SignatureGenerator({
	width = 600,
	height = 300,
	initialValue,
	onConfirm,
}: SignatureGeneratorProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	const [text, setText] = useState(initialValue || 'Seu Nome')
	const [fontSize, setFontSize] = useState(48)

	const drawSignature = () => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		canvas.width = width
		canvas.height = height

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		ctx.fillStyle = '#000'
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'

		ctx.font = `${fontSize}px Pacifico, cursive`

		ctx.fillText(text, canvas.width / 2, canvas.height / 2)
	}

	const isEmpty = () => {
		const canvas = canvasRef.current
		if (!canvas) return true

		const blank = document.createElement('canvas')
		blank.width = canvas.width
		blank.height = canvas.height

		return canvas.toDataURL() === blank.toDataURL()
	}

	const handleConfirm = () => {
		if (!isEmpty()) {
			const canvas = canvasRef.current
			if (!canvas) return

			const dataBase64 = canvas.toDataURL('image/png')
			onConfirm?.(dataBase64)
		} else {
			onConfirm?.(null)
		}
	}

	useEffect(() => {
		drawSignature()
		handleConfirm()
	}, [text, fontSize])

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
			<Input.Text
				label='Nome'
				placeholder='Nome completo'
				value={text}
				required
				onChange={(e) => setText(e.target.value)}
				icon={
					<Icon
						path={mdiAccountCircle}
						size={1}
					/>
				}
			/>

			<input
				type='range'
				min={20}
				max={100}
				value={fontSize}
				onChange={(e) => setFontSize(Number(e.target.value))}
			/>

			<canvas
				ref={canvasRef}
				style={{ border: '1px solid #ccc', borderRadius: 8 }}
			/>
		</div>
	)
}
