import type { InputHTMLAttributes, ReactNode } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

export type InputRootProps = {
	children: ReactNode
}

export type InputCheckboxProps = {
	checked: boolean
	onChange: (checked: boolean) => void
	label?: string
	disabled?: boolean
	errorMessage?: string
}

export type FormCheckboxProps<T extends FieldValues> = Omit<
	InputCheckboxProps,
	'checked' | 'onChange'
> & {
	name: Path<T>
	control: Control<T>
}

export type InputTextProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string
	icon?: ReactNode
	errorMessage?: string
}

export type FormInputProps<T extends FieldValues> = InputTextProps & {
	name: Path<T>
	control: Control<T>
}

export type InputMaskProps = InputHTMLAttributes<HTMLInputElement> & {
	label: string
	icon?: ReactNode
	errorMessage?: string
	mask: string
	onAccept?: (value: string, maskRef: unknown) => void
}

export type InputErrorProps = {
	errorMessage: string
}
