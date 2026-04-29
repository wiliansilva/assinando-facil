import { mdiRefresh } from '@mdi/js'
import Icon from '@mdi/react'
import Button from '../Button'
import './style.css'

const ERROR_MESSAGES: Record<string, string> = {
	'Network Error':
		'Não foi possível conectar no momento. Verifique sua internet e tente novamente.',
	'Página não encontrada.': 'A Página solicitada não foi encontrada.',
	'Documento não encontrado.':
		'Este documento não está disponível. Ele pode já ter sido assinado ou o link pode ter expirado.',
	'O parâmetro contrato deve ser um UUID válido.':
		'O link informado é inválido ou está incompleto. Verifique e tente novamente.',
}

function resolveMessage(message?: string): string {
	if (!message)
		return 'Não foi possível carregar as informações. Tente novamente.'
	return (
		ERROR_MESSAGES[message] ??
		'Ocorreu um erro inesperado. Tente novamente.'
	)
}

interface ErrorDisplayProps {
	message?: string
	errorCode?: string | number | null
	onRetry?: () => void
}

export function ErrorDisplay({
	message,
	errorCode = '404',
	onRetry,
}: ErrorDisplayProps) {
	const displayMessage = resolveMessage(message)

	return (
		<div className='error-display'>
			<div className='error-display__card'>
				<div className='error-display__content'>
					<div className='error-display__badge'>
						Erro {errorCode ? errorCode : 'desconecido'}
					</div>
					<p className='error-display__message'>Algo deu errado</p>
					<h1 className='error-display__title'>{message}</h1>
					<p className='error-display__message'>{displayMessage}</p>
					<p className='error-display__message'>
						Se precisar de ajuda, acesse nossa{' '}
						<a
							href='/central-de-ajuda'
							target='_blank'
							rel='noopener noreferrer'
						>
							Central de Ajuda
						</a>{' '}
						ou envie um e-mail para{' '}
						<a href='mailto:ajuda@assinandofacil.com'>
							ajuda@assinandofacil.com
						</a>
					</p>

					{onRetry && (
						<Button
							type='primary'
							Label='Tentar novamente'
							onClick={onRetry}
							icon={
								<Icon
									path={mdiRefresh}
									size={1}
								/>
							}
						/>
					)}
				</div>
				<div className='error-display__image-wrapper'>
					<img
						src='./src/assets/404-illustration.webp'
						alt='Ilustração de erro'
						loading='lazy'
						className='error-display__image'
					/>
				</div>
			</div>
		</div>
	)
}
