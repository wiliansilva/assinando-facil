import type { TextProps } from '../types'

export default function TextTitle({ value, icon }: TextProps) {
	return (
		<div className='text'>
			{icon && <div className='text-icon'>{icon}</div>}
			<h1 className='text-title'>{value}</h1>
		</div>
	)
}
