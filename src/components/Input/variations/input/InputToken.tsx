import React, { useRef } from 'react'
import type { TokenInputProps } from '../../types'
import InputError from './InputError'

export function TokenInput({
	length = 6,
	value,
	onChange,
	errors = '',
}: TokenInputProps) {
	const inputsRef = useRef<Array<HTMLInputElement | null>>([])

	const handleChange = (val: string, index: number) => {
		// aceita apenas letras e números
		if (!/^[a-zA-Z]?$/.test(val)) return

		const char = val.toUpperCase()

		const newValue = value.split('')
		newValue[index] = char
		const updated = newValue.join('')

		onChange(updated)

		if (char && index < length - 1) {
			inputsRef.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
		if (e.key === 'Backspace') {
			if (!value[index] && index > 0) {
				inputsRef.current[index - 1]?.focus()
			}
		}
	}

	const handlePaste = (e: React.ClipboardEvent) => {
		const pasted = e.clipboardData
			.getData('text')
			.replace(/[^a-zA-Z0-9]/g, '')
			.toUpperCase()

		if (!pasted) return

		const newValue = pasted.slice(0, length)
		onChange(newValue)

		const lastIndex = newValue.length - 1
		if (lastIndex >= 0) {
			inputsRef.current[lastIndex]?.focus()
		}
	}

	return (
		<div className='token-input-wrapper'>
			<div
				className='token-input-container'
				onPaste={handlePaste}
			>
				{Array.from({ length }).map((_, index) => (
					<input
						key={index}
						ref={(el) => {
							inputsRef.current[index] = el
						}}
						value={value[index] || ''}
						onChange={(e) => handleChange(e.target.value, index)}
						onKeyDown={(e) => handleKeyDown(e, index)}
						maxLength={1}
						className={`input-token ${errors && !value[index] ? ' input-error' : ''}`}
					/>
				))}
			</div>
			{errors && <InputError errorMessage={errors} />}
		</div>
	)
}
