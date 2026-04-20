import type { FloatButtonProps } from '../types'

export default function FloatButton({
	icon,
	onClick,
	title,
	disabled = false,
	style,
}: FloatButtonProps) {
	return (
		<div
			className={`btn float ${disabled ? 'disabled' : ''}`}
			onClick={!disabled ? onClick : undefined}
			title={title}
			style={style}
		>
			{icon}
		</div>
	)
}
