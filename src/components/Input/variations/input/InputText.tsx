import { useId } from 'react'
import type { InputTextProps } from '../../types'
import InputError from './InputError'

export function InputText({
	label,
	icon,
	required = false,
	disabled = false,
	id,
	className,
	errorMessage,
	...props
}: InputTextProps) {
	const generatedId = useId()
	const inputId = id ?? generatedId

	return (
		<label
			className={`input-text ${disabled ? 'disabled' : ''} ${className ?? ''}`.trim()}
			htmlFor={inputId}
		>
			<span className='input-text__label'>
				{label}
				{required && <span className='input-text__required'>*</span>}
			</span>

			<span className='input-text__control'>
				{icon && <span className='input-text__icon'>{icon}</span>}
				<input
					{...props}
					id={inputId}
					className='input-text__input'
					required={required}
					disabled={disabled}
				/>
			</span>
			{errorMessage && <InputError errorMessage={errorMessage} />}
		</label>
	)
}
