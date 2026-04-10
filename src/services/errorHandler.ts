import type { AxiosError } from 'axios'
import type { ApiError, ApiErrorResponse } from './types'

export function extractApiError(error: unknown): ApiError {
	// Se for um erro do axios
	if (error && typeof error === 'object' && 'isAxiosError' in error) {
		const axiosError = error as AxiosError<ApiErrorResponse>

		const statusCode = axiosError.response?.status
		const responseData = axiosError.response?.data

		// Se a resposta contém um array de erros
		if (
			responseData &&
			'erros' in responseData &&
			Array.isArray(responseData.erros)
		) {
			return {
				message:
					responseData.erros[0] || 'Erro ao processar a requisição',
				errors: responseData.erros,
				statusCode,
			}
		}

		// Se tem mensagem padrão do erro
		if (axiosError.message) {
			return {
				message: axiosError.message,
				errors: [axiosError.message],
				statusCode,
			}
		}
	}

	// Fallback para erros genéricos
	const errorMessage =
		error instanceof Error
			? error.message
			: 'Erro desconhecido ao processar a requisição'

	return {
		message: errorMessage,
		errors: [errorMessage],
	}
}

export function formatErrorMessage(error: ApiError): string {
	return error.message
}

export function formatErrorList(errors: string[]): string {
	if (errors.length === 0) return 'Erro desconhecido'
	if (errors.length === 1) return errors[0]
	return errors.join('\n• ')
}
