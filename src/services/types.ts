export type ApiErrorResponse = {
	erros: string[]
}

export type ApiError = {
	message: string
	errors: string[]
	statusCode?: number
}
