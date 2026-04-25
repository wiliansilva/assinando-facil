import './style.css'

function SkPulse({ className = '' }: { className?: string }) {
	return (
		<div
			className={`sk-pulse ${className}`}
			aria-hidden='true'
		/>
	)
}

export function SignatureSkeletonBody() {
	return (
		<section className='wizard-body'>
			<div className='sk-body-content'>
				<SkPulse className='sk-body-heading' />
				<div className='sk-fields'>
					<div className='sk-field'>
						<SkPulse className='sk-label' />
						<SkPulse className='sk-input' />
					</div>
					<div className='sk-field'>
						<SkPulse className='sk-label' />
						<SkPulse className='sk-input' />
					</div>
					<div className='sk-field'>
						<SkPulse className='sk-label' />
						<SkPulse className='sk-block' />
					</div>
				</div>
			</div>
		</section>
	)
}

export function SignatureSkeleton() {
	return (
		<div
			className='wizard-layout'
			aria-busy='true'
			aria-label='Carregando...'
		>
			{/* ── Conteúdo principal ───────────────────────── */}
			<main className='wizard-layout__content'>
				{/* Header skeleton — oculto no mobile via wizard-header CSS */}
				<header className='wizard-header'>
					<div className='wizard-header-content'>
						<div className='wizard-header-left'>
							<SkPulse className='sk-btn' />
						</div>
						<div className='wizard-header-center'>
							<SkPulse className='sk-title' />
							<SkPulse className='sk-step-counter' />
						</div>
						<div className='wizard-header-right'>
							<SkPulse className='sk-btn' />
						</div>
					</div>
					<div className='wizard-progress'>
						<div
							className='wizard-progress-bar'
							style={{ width: '5%' }}
						/>
					</div>
				</header>

				{/* Footer mobile — oculto no desktop via wizard-nav-footer CSS */}
				<div className='wizard-nav-footer'>
					<div className='wizard-nav-footer__progress'>
						<div
							className='wizard-nav-footer__progress-bar'
							style={{ width: '5%' }}
						/>
					</div>
					<div className='wizard-nav-footer__side'>
						<SkPulse className='sk-btn-mobile' />
					</div>
					<div className='wizard-nav-footer__center'>
						<SkPulse className='sk-counter-mobile' />
					</div>
					<div className='wizard-nav-footer__side wizard-nav-footer__side--right'>
						<SkPulse className='sk-btn-mobile' />
					</div>
				</div>

				{/* Body skeleton */}
				<SignatureSkeletonBody />
			</main>

			{/* ── Sidebar ──────────────────────────────────── */}
			<aside className='wizard-layout__sidebar'>
				<div className='wizard-layout__sidebar-inner'>
					{/* Desktop — oculto no mobile via wcs-desktop CSS */}
					<div className='wcs-desktop wizard-check-steps'>
						<div className='wizard-check-steps__brand'>
							<SkPulse className='sk-logo' />
							<SkPulse className='sk-company-name' />
						</div>
						<div className='wizard-check-steps__intro'>
							<SkPulse className='sk-intro-title' />
							<SkPulse className='sk-intro-sub' />
						</div>
						<ol className='wizard-check-steps__timeline'>
							{Array.from({ length: 4 }).map((_, i) => (
								<li
									key={i}
									className='wizard-check-steps__item'
								>
									<span className='wizard-check-steps__marker' />
									<SkPulse className='sk-step-label' />
								</li>
							))}
						</ol>
					</div>

					{/* Mobile — oculto no desktop via wcs-mobile CSS */}
					<div className='wcs-mobile'>
						<div className='wcs-mobile__brand'>
							<SkPulse className='sk-logo-mobile' />
							<SkPulse className='sk-company-mobile' />
						</div>
						<SkPulse className='sk-step-title-mobile' />
						<div className='wcs-mobile__collapsed-row'>
							<div className='wcs-mobile__dots'>
								{Array.from({ length: 4 }).map((_, i) => (
									<span
										key={i}
										className='wcs-mobile__dot'
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</aside>
		</div>
	)
}
