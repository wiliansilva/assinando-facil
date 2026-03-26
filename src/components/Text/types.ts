import type { ReactNode } from 'react'

export enum TextType {
	title = 'title',
	subTitle = 'subTitle',
}
export type TextProps = {
	value: string
	type: TextType
	icon?: ReactNode
}
