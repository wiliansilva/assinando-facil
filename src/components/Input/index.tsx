import './style.css'
import { FormCheckbox } from './variations/form/FormCheckbox'
import { FormInput } from './variations/form/FormInput'
import { FormMask } from './variations/form/FormMask'
import { InputCheckbox } from './variations/input/InputCheckbox'
import { InputMask } from './variations/input/InputMask'
import { InputRoot } from './variations/input/InputRoot'
import { InputText } from './variations/input/InputText'
export const Input = {
	Root: InputRoot,
	Checkbox: InputCheckbox,
	Text: InputText,
	Mask: InputMask,
}

export const Form = {
	Checkbox: FormCheckbox,
	Text: FormInput,
	Mask: FormMask,
}
