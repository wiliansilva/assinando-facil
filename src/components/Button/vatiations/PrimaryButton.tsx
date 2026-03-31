import type { CommonButtonProps } from '../types'

export default function PrimaryButton({
	onClick,
	Label = '',
	disabled = false,
	style,
	icon,
}: CommonButtonProps) {
	return (
		<div
			className={`btn primary ${disabled && 'disabled'}`}
			onClick={onClick}
			style={style}
		>
			{icon}
			{Label}
		</div>
	)
}
