import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Input } from '../..'
import type { FormCheckboxProps } from '../../types'

export function FormCheckbox<T extends FieldValues>({
	name,
	control,
	label,
	disabled,
	errorMessage,
}: FormCheckboxProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Input.Checkbox
					label={label}
					checked={field.value ?? false}
					onChange={field.onChange}
					disabled={disabled}
					errorMessage={fieldState.error?.message || errorMessage}
				/>
			)}
		/>
	)
}
