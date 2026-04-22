import { mdiEraserVariant, mdiInformationOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import Text from '../Text'
import { TextType } from '../Text/types'
import './style.css'

type SignatureCaptureProps = {
	width?: number
	height?: number
	onConfirm?: (dataUrl: string | null) => void
	initialValue?: string | null
}

export default function SignatureCapture({
	width = 600,
	height = 300,
	onConfirm,
	initialValue,
}: SignatureCaptureProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [isDrawing, setIsDrawing] = useState(false)

	const getContext = () => {
		const canvas = canvasRef.current
		return canvas?.getContext('2d')
	}

	/* Converte coordenadas CSS para coordenadas internas do canvas */
	const toCanvasCoords = (cssX: number, cssY: number) => {
		const canvas = canvasRef.current
		if (!canvas) return { x: cssX, y: cssY }
		const rect = canvas.getBoundingClientRect()
		return {
			x: (cssX / rect.width) * canvas.width,
			y: (cssY / rect.height) * canvas.height,
		}
	}

	const startDrawing = (cssX: number, cssY: number) => {
		const ctx = getContext()
		if (!ctx) return
		const { x, y } = toCanvasCoords(cssX, cssY)
		ctx.beginPath()
		ctx.moveTo(x, y)
		setIsDrawing(true)
	}

	const draw = (cssX: number, cssY: number) => {
		if (!isDrawing) return
		const ctx = getContext()
		if (!ctx) return
		const { x, y } = toCanvasCoords(cssX, cssY)
		ctx.lineTo(x, y)
		ctx.stroke()
	}

	const stopDrawing = () => {
		setIsDrawing(false)
		handleConfirm()
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
			onConfirm?.(canvas.toDataURL('image/png'))
		}
	}

	const clear = () => {
		const canvas = canvasRef.current
		const ctx = getContext()
		if (!canvas || !ctx) return
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		onConfirm?.(null)
	}

	/* Mouse */
	const handleMouseDown = (e: React.MouseEvent) => {
		startDrawing(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
	}

	const handleMouseMove = (e: React.MouseEvent) => {
		draw(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
	}

	/* Touch */
	const getTouchPos = (e: React.TouchEvent) => {
		const rect = canvasRef.current!.getBoundingClientRect()
		const touch = e.touches[0]
		return {
			x: touch.clientX - rect.left,
			y: touch.clientY - rect.top,
		}
	}

	const handleTouchStart = (e: React.TouchEvent) => {
		e.preventDefault()
		const { x, y } = getTouchPos(e)
		startDrawing(x, y)
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		e.preventDefault()
		const { x, y } = getTouchPos(e)
		draw(x, y)
	}

	useEffect(() => {
		const ctx = getContext()
		if (!ctx) return
		ctx.lineWidth = 4
		ctx.lineCap = 'round'
		ctx.strokeStyle = '#000'
	}, [])

	useEffect(() => {
		if (!initialValue || !canvasRef.current) return
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		if (!ctx) return
		const img = new Image()
		img.onload = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
		}
		img.src = initialValue
	}, [initialValue])

	return (
		<div className='signature-capture'>
			<Text
				type={TextType.subTitle}
				value='Sua assinatura será aplicada nos locais indicados no documento e protegida contra alterações.'
				icon={
					<Icon
						path={mdiInformationOutline}
						size={1}
						color='var(--secondary-font-color)'
					/>
				}
			/>
			<div className='signature-capture__canvas-wrapper'>
				<canvas
					ref={canvasRef}
					width={width}
					height={height}
					className='signature-capture__canvas'
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={stopDrawing}
					onMouseLeave={stopDrawing}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={stopDrawing}
				/>
			</div>

			<div className='signature-capture__btn-actions'>
				<Button
					type='secondary'
					onClick={clear}
					Label='Limpar'
					icon={
						<Icon
							path={mdiEraserVariant}
							size={1}
						/>
					}
				/>
			</div>
		</div>
	)
}
