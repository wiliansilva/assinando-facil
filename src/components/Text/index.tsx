import './style.css'
import { TextType, type TextProps } from './types'
import TextSubTitle from './variations/TextSubTitle'
import TextTitle from './variations/TextTitle'

export default function Text(props: TextProps) {
	switch (props.type) {
		case TextType.subTitle:
			return <TextSubTitle {...props} />
		default:
			return <TextTitle {...props} />
	}
}
