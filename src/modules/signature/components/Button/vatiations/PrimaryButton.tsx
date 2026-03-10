import type { CommonButtonProps } from '../types'

export default function PrimaryButton({
	onClick,
	Label = '',
	disabled = false,
	style,
}: CommonButtonProps) {
	return (
		<div
			className={`btn primary ${disabled && 'disabled'}`}
			onClick={onClick}
			style={style}
		>
			{Label}
		</div>
	)
}
