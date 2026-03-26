import type { WizardLayoutProps } from '../types'
import './style.css'

export function WizardLayout({ children }: WizardLayoutProps) {
	return <div className='wizard-layout'>{children}</div>
}
