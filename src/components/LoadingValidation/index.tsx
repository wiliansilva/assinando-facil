import './style.css'

export default function LoadingValidation({
	message = 'Validando documento...',
}: {
	message?: string
}) {
	return (
		<div className='document-validating'>
			<div className='lc-ring' />
			<span className='lc-loading-label'>{message}</span>
		</div>
	)
}
