import type { ReactNode } from 'react'

type Props = {
	title: string
	children: ReactNode
	onNext?: () => void
	onBack?: () => void
	disableNext?: boolean
}

export function WizardLayout({
	title,
	children,
	onNext,
	onBack,
	disableNext,
}: Props) {
	return (
		<div style={{ maxWidth: 600, margin: '40px auto' }}>
			<h2>{title}</h2>

			<div style={{ marginTop: 20 }}>{children}</div>

			<div style={{ marginTop: 30, display: 'flex', gap: 10 }}>
				{onBack && <button onClick={onBack}>Voltar</button>}
				{onNext && (
					<button
						onClick={onNext}
						disabled={disableNext}
					>
						Avançar
					</button>
				)}
			</div>
		</div>
	)
}
