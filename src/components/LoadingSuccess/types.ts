export const SHAPES = ['rect', 'circle', 'ribbon'] as const

export type Phase = 'loading' | 'success'

export type LoadingCheckProps = {
	isLoading?: boolean
	successDuration?: number
	loadingText?: string
	successText?: string
	onComplete?: () => void
}

export type Shape = (typeof SHAPES)[number]

export type Particle = {
	x: number
	y: number
	vx: number
	vy: number
	gravity: number
	rotation: number
	rotSpeed: number
	color: string
	w: number
	h: number
	alpha: number
	shape: Shape
}
