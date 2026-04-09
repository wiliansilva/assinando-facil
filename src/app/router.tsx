// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../components/ErrorPage'
import { SignaturePage } from '../modules/signature/SignaturePage'

export const router = createBrowserRouter([
	{
		path: '/assinar/:id',
		element: <SignaturePage />,
		errorElement: <ErrorPage />,
	},
])
