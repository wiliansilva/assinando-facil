import type { CSSProperties, ReactNode } from 'react'

export type ButtonType = 'primary' | 'secondary' | 'float'

export type CommonButtonProps = {
	Label?: string
	onClick: () => void
	title?: string
	type?: ButtonType
	disabled?: boolean
	style?: CSSProperties
	icon?: ReactNode
}

export type FloatButtonProps = CommonButtonProps & {
	type: 'float'
	icon: ReactNode
}
