import type { InputCheckboxProps } from '../../types'
import InputError from './InputError'

export function InputCheckbox({
	checked,
	onChange,
	label,
	disabled = false,
	errorMessage,
}: InputCheckboxProps) {
	return (
		<div>
			<label className={`input-checkbox ${disabled ? 'disabled' : ''}`}>
				<input
					type='checkbox'
					checked={checked ?? false}
					onChange={(e) => onChange(e.target.checked)}
					disabled={disabled}
				/>

				<span className='checkmark' />

				{label && <span className='label'>{label}</span>}
			</label>
			{errorMessage && <InputError errorMessage={errorMessage} />}
		</div>
	)
}
