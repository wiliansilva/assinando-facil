import {
	mdiCamera,
	mdiCameraRetake,
	mdiCheck,
	mdiFlash,
	mdiFlashOff,
	mdiSync,
} from '@mdi/js'
import Icon from '@mdi/react'
import Button from '../Button'
import { useCamera } from './hooks/useCamera'
import './style.css'
import type { CameraCaptureProps } from './types'

export function CameraCapture({
	onClose,
	onConfirm,
	title,
	showGuide = true,
}: CameraCaptureProps) {
	const {
		videoRef,
		state: cameraState,
		error: cameraError,
		preview,
		hasTorch,
		torchOn,
		hasMultipleCameras,
		capture,
		retake,
		confirm,
		close,
		toggleTorch,
		switchCamera,
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

						{/* Document guide overlay */}
						{cameraState === 'streaming' && showGuide && (
							<div
								className='camera-guide'
								aria-hidden='true'
							>
								<div className='camera-guide-frame'>
									<div className='camera-guide-corner camera-guide-corner--tl' />
									<div className='camera-guide-corner camera-guide-corner--tr' />
									<div className='camera-guide-corner camera-guide-corner--bl' />
									<div className='camera-guide-corner camera-guide-corner--br' />
								</div>
								<p className='camera-guide-hint'>
									Enquadre o documento
								</p>
							</div>
						)}

						{/* Torch + camera flip controls */}
						{cameraState === 'streaming' &&
							(hasTorch || hasMultipleCameras) && (
								<div className='camera-viewfinder-controls'>
									{hasTorch && (
										<button
											className={`camera-overlay-btn ${torchOn ? 'camera-overlay-btn--active' : ''}`}
											onClick={toggleTorch}
											aria-label={
												torchOn
													? 'Desligar lanterna'
													: 'Ligar lanterna'
											}
										>
											<Icon
												path={
													torchOn
														? mdiFlashOff
														: mdiFlash
												}
												size={0.8}
											/>
										</button>
									)}
									{hasMultipleCameras && (
										<button
											className='camera-overlay-btn'
											onClick={switchCamera}
											aria-label='Trocar câmera'
										>
											<Icon
												path={mdiSync}
												size={0.8}
											/>
										</button>
									)}
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
								Label='Tentar novamente'
								onClick={retake}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}
