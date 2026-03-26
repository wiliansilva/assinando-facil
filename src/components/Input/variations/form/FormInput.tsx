import type { FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Input } from '../..'
import type { FormInputProps } from '../../types'

export function FormInput<T extends FieldValues>({
	name,
	control,
	...props
}: FormInputProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => (
				<Input.Text
					{...props}
					value={field.value ?? ''}
					errorMessage={
						fieldState.error?.message || props.errorMessage
					}
					onChange={(e) => field.onChange(e.target.value)}
					onBlur={field.onBlur}
				/>
			)}
		/>
	)
}
