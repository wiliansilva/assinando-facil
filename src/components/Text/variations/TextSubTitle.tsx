import type { TextProps } from '../types'

export default function TextSubTitle({ value, icon }: TextProps) {
	return (
		<div className='text'>
			{icon && <div className='text-icon'>{icon}</div>}
			<h2 className='text-subtitle'>{value}</h2>
		</div>
	)
}
