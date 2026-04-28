// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom'
import { ErrorDisplay } from '../components/ErrorDisplay'
import { SignaturePage } from '../modules/signature/SignaturePage'

export const router = createBrowserRouter([
	{
		path: '/assinar/:id',
		element: <SignaturePage />,
		errorElement: (
			<ErrorDisplay
				message='Página não encontrada.'
				onRetry={() => window.location.reload()}
			/>
		),
	},
])
