import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
	const error = useRouteError()
	const message =
		error instanceof Error ? error.message : 'Ocorreu um erro inesperado.'

	return (
		<div>
			<h1>Erro!</h1>
			<p>{message}</p>
		</div>
	)
}
