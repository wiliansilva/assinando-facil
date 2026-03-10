import type { ReactNode } from 'react'

type WizardLayoutProps = {
	children: ReactNode
}

export function WizardLayout({ children }: WizardLayoutProps) {
	return <>{children}</>
}
