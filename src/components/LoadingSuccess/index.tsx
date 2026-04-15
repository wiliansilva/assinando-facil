import { useEffect, useRef } from 'react'
import './style.css'
import {
	SHAPES,
	type LoadingCheckProps,
	type Particle,
	type Phase,
} from './types'

const COLORS = [
	'#f94144',
	'#f3722c',
	'#f9c74f',
	'#90be6d',
	'#43aa8b',
	'#4d908e',
	'#577590',
	'#f72585',
	'#7209b7',
	'#3a86ff',
]

function spawnParticles(cx: number, cy: number): Particle[] {
	return Array.from({ length: 140 }, () => {
		const angle = Math.random() * Math.PI * 2
		const speed = 3.5 + Math.random() * 5.5
		return {
			x: cx,
			y: cy,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed - 2,
			gravity: 0.18 + Math.random() * 0.12,
			rotation: Math.random() * 360,
			rotSpeed: (Math.random() - 0.5) * 12,
			color: COLORS[Math.floor(Math.random() * COLORS.length)],
			w: 6 + Math.random() * 7,
			h: 4 + Math.random() * 5,
			alpha: 1,
			shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
		}
	})
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
	ctx.save()
	ctx.globalAlpha = p.alpha
	ctx.translate(p.x, p.y)
	ctx.rotate((p.rotation * Math.PI) / 180)
	ctx.fillStyle = p.color
	if (p.shape === 'rect') {
		ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
	} else if (p.shape === 'circle') {
		ctx.beginPath()
		ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
		ctx.fill()
	} else {
		ctx.beginPath()
		ctx.ellipse(0, 0, p.w / 2, p.h / 4, 0, 0, Math.PI * 2)
		ctx.fill()
	}
	ctx.restore()
}

export function LoadingSuccess({
	isLoading = true,
	successDuration = 1500,
	loadingText = 'Aguarde...',
	successText = 'Concluído!',
	onComplete,
}: LoadingCheckProps) {
	const phase: Phase = isLoading ? 'loading' : 'success'
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const wrapRef = useRef<HTMLDivElement>(null)
	const rafRef = useRef<number>(0)

	useEffect(() => {
		if (phase !== 'success') return
		const canvas = canvasRef.current
		const wrap = wrapRef.current
		if (!canvas || !wrap) return

		canvas.width = wrap.offsetWidth
		canvas.height = wrap.offsetHeight
		const ctx = canvas.getContext('2d')!
		const cx = canvas.width / 2
		const cy = canvas.height / 2
		let particles = spawnParticles(cx, cy)

		function loop() {
			ctx.clearRect(0, 0, canvas!.width, canvas!.height)
			particles = particles.filter((p) => p.alpha > 0.02)
			for (const p of particles) {
				p.x += p.vx
				p.y += p.vy
				p.vy += p.gravity
				p.vx *= 0.99
				p.rotation += p.rotSpeed
				p.alpha -= 0.012
				drawParticle(ctx, p)
			}
			if (particles.length > 0) {
				rafRef.current = requestAnimationFrame(loop)
			}
		}
		rafRef.current = requestAnimationFrame(loop)

		const t = onComplete ? setTimeout(onComplete, successDuration) : null
		return () => {
			if (t) clearTimeout(t)
			cancelAnimationFrame(rafRef.current)
		}
	}, [phase, onComplete, successDuration])

	return (
		<div
			ref={wrapRef}
			className='lc-screen'
		>
			<canvas
				ref={canvasRef}
				className='lc-canvas'
			/>

			{phase === 'loading' && (
				<>
					<div className='lc-ring' />
					<span className='lc-loading-label'>{loadingText}</span>
				</>
			)}

			{phase === 'success' && (
				<div className='lc-success-wrap'>
					<div className='lc-circle-bg'>
						<svg
							viewBox='0 0 52 52'
							width={52}
							height={52}
							fill='none'
							stroke='#fff'
							strokeWidth={5}
							strokeLinecap='round'
							strokeLinejoin='round'
							style={{ overflow: 'visible' }}
						>
							<polyline
								points='12,27 22,37 40,15'
								className='lc-check-path'
							/>
						</svg>
					</div>
					<span className='lc-done-text'>{successText}</span>
				</div>
			)}
		</div>
	)
}
