import type { CommonButtonProps } from '../types'

export default function SecondaryButton({
	onClick,
	Label = '',
	disabled = false,
	style,
}: CommonButtonProps) {
	return (
		<div
			className={`btn secondary ${disabled && 'disabled'}`}
			onClick={onClick}
			style={style}
		>
			{Label}
		</div>
	)
}
