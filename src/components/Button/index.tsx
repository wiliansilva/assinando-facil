import './style.css'
import type { CommonButtonProps } from './types'
import PrimaryButton from './vatiations/PrimaryButton'
import SecondaryButton from './vatiations/SecondaryButton'

export default function Button(props: CommonButtonProps) {
	switch (props.type) {
		case 'secondary':
			return <SecondaryButton {...props} />
		default:
			return <PrimaryButton {...props} />
	}
}
