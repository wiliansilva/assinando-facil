import type { WizardBodyProps } from '../types'
import './style.css'

export function WizardBody({ children }: WizardBodyProps) {
	return <section className='wizard-body'>{children}</section>
}
