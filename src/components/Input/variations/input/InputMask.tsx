import { useId } from 'react'
import { IMaskInput } from 'react-imask'
import type { InputMaskProps } from '../../types'
import InputError from './InputError'

export function InputMask({
	label,
	icon,
	required = false,
	disabled = false,
	id,
	className,
	errorMessage,
	mask,
	onAccept,
	...props
}: InputMaskProps) {
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

				<IMaskInput
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					{...(props as any)}
					id={inputId}
					mask={mask}
					unmask={false}
					disabled={disabled}
					className={`input-text__input ${
						errorMessage ? 'input-text__error' : ''
					}`}
					onAccept={(value: string, maskRef) => {
						onAccept?.(value, maskRef)
					}}
				/>
			</span>

			{errorMessage && <InputError errorMessage={errorMessage} />}
		</label>
	)
}
