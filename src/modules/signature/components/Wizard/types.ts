import type { ReactNode } from 'react'

export type WizardHeaderProps = {
	title: string
	stepNumber?: number
	totalSteps?: number
	onDownload?: () => void
	onNext?: () => void
	onBack?: () => void
	disableDownload?: boolean
}

export type WizardLayoutProps = {
	children: ReactNode
}

export type WizardBodyProps = {
	children: ReactNode
}
