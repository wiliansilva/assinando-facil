import type { Control, FieldValues, Path } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Input } from '../..'
import type { InputMaskProps } from '../../types'

type FormMaskProps<T extends FieldValues> = InputMaskProps & {
	name: Path<T>
	control: Control<T>
}

export function FormMask<T extends FieldValues>({
	name,
	control,
	...props
}: FormMaskProps<T>) {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field, fieldState }) => {
				const errorMessage =
					fieldState.error?.message || props.errorMessage

				return (
					<Input.Mask
						{...props}
						value={field.value ?? ''}
						errorMessage={errorMessage}
						onAccept={(value: string) => field.onChange(value)}
						onBlur={field.onBlur}
					/>
				)
			}}
		/>
	)
}
