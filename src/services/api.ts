// src/services/api.ts
import axios, { type AxiosError } from 'axios'
import type { ApiErrorResponse } from '../modules/signature/services/types'
import { extractApiError } from './errorHandler'

export const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

api.interceptors.response.use(
	(response) => response,
	(error: AxiosError<ApiErrorResponse>) => {
		const apiError = extractApiError(error)

		console.error('API Error:', {
			statusCode: apiError.statusCode,
			message: apiError.message,
			errors: apiError.errors,
		})

		return Promise.reject(apiError)
	},
)
