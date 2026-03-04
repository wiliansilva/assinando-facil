import { createBrowserRouter } from 'react-router-dom'
import { SignatureFlow } from '../modules/signature/SignatureFlow'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <SignatureFlow />,
	},
])
