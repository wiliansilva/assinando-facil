import { mdiCamera, mdiCameraRetake, mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import Button from '../Button'
import { useCamera } from './hooks/useCamera'
import './style.css'
import type { CameraCaptureProps } from './types'

export function CameraCapture({
	onClose,
	onConfirm,
	title,
}: CameraCaptureProps) {
	const {
		videoRef,
		state: cameraState,
		error: cameraError,
		preview,
		capture,
		retake,
		confirm,
		close,
	} = useCamera()

	return (
		<>
			<div className='camera-overlay'>
				<div className='camera-modal'>
					{/* Header */}
					<div className='camera-header'>
						<div></div>
						<span className='camera-title'>{title}</span>
						<button
							className='camera-icon-btn'
							onClick={() => close(onClose)}
							aria-label='Fechar'
						>
							<svg
								width='24'
								height='24'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
							>
								<line
									x1='18'
									y1='6'
									x2='6'
									y2='18'
								/>
								<line
									x1='6'
									y1='6'
									x2='18'
									y2='18'
								/>
							</svg>
						</button>
					</div>

					{/* Viewfinder */}
					<div className='camera-viewfinder'>
						{cameraState === 'preview' && preview ? (
							<img
								src={preview}
								alt='Prévia da foto'
								className='camera-media'
							/>
						) : (
							<video
								ref={videoRef}
								autoPlay
								playsInline
								muted
								className='camera-media'
							/>
						)}

						{cameraState === 'error' && (
							<div className='camera-error-overlay'>
								<svg
									width='32'
									height='32'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='1.5'
								>
									<circle
										cx='12'
										cy='12'
										r='10'
									/>
									<line
										x1='12'
										y1='8'
										x2='12'
										y2='12'
									/>
									<line
										x1='12'
										y1='16'
										x2='12.01'
										y2='16'
									/>
								</svg>
								<p>{cameraError}</p>
							</div>
						)}

						{cameraState === 'idle' && (
							<div className='camera-loading'>
								<div className='camera-spinner' />
							</div>
						)}
					</div>

					{/* Actions */}
					<div className='camera-actions'>
						{cameraState === 'streaming' && (
							<Button
								type='primary'
								Label='Capturar'
								onClick={capture}
								icon={
									<Icon
										path={mdiCamera}
										size={1}
									/>
								}
							/>
						)}

						{cameraState === 'preview' && (
							<>
								<Button
									type='secondary'
									Label='Tirar novamente'
									onClick={retake}
									icon={
										<Icon
											path={mdiCameraRetake}
											size={1}
										/>
									}
								/>
								<Button
									type='primary'
									Label='Confirmar'
									onClick={() => confirm(onConfirm, onClose)}
									icon={
										<Icon
											path={mdiCheck}
											size={1}
										/>
									}
								/>
							</>
						)}

						{cameraState === 'error' && (
							<Button
								type='secondary'
								Label='Tirar novamente'
								onClick={retake}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
