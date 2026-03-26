import { mdiAlertCircle } from '@mdi/js'
import Icon from '@mdi/react'
import type { InputErrorProps } from '../../types'

export default function InputError({ errorMessage }: InputErrorProps) {
	return (
		<div className='input-error-message'>
			<Icon
				path={mdiAlertCircle}
				size={0.8}
			/>
			<span>{errorMessage}</span>
		</div>
	)
}
