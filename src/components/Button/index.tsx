import './style.css'
import type { CommonButtonProps } from './types'
import FloatButton from './vatiations/FloatButton'
import PrimaryButton from './vatiations/PrimaryButton'
import SecondaryButton from './vatiations/SecondaryButton'

export default function Button(props: CommonButtonProps) {
	switch (props.type) {
		case 'secondary':
			return <SecondaryButton {...props} />
		case 'float':
			return (
				<FloatButton
					{...props}
					type='float'
					icon={props.icon!}
				/>
			)
		default:
			return <PrimaryButton {...props} />
	}
}
