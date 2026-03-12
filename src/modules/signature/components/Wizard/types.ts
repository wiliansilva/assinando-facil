export type WizardHeaderProps = {
	title: string
	step?: number
	totalSteps?: number
	onDownload?: () => void
	onNext?: () => void
	onBack?: () => void
	disableDownload?: boolean
}
