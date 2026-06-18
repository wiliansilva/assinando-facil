import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { formatErrorMessage } from '../../../services/errorHandler'
import { isoToBR } from '../../../utils/dates'
import { signatureService } from '../services/getSignature'

import type { ApiError } from '../../../services/types'
import type { GetSignatureResponse } from '../services/getSignature/types'
import { useSignatureStore } from '../store/signature.store'

export function useSignatureData() {
	const { id: assinaturaId } = useParams<{ id: string }>()
	const [searchParams] = useSearchParams()
	const accessToken = searchParams.get('access_token')
	const { updateData, setCpfEditable, setCompany } = useSignatureStore()

	const isValidParams = Boolean(assinaturaId && accessToken)

	const [data, setData] = useState<GetSignatureResponse | null>(null)
	const [isLoading, setLoading] = useState(isValidParams)
	const [errorCode, setErrorCode] = useState<number | null>(0)
	const [error, setError] = useState<string | null>(
		isValidParams ? null : 'Parâmetros inválidos na URL.',
	)

	useEffect(() => {
		if (!isValidParams) return

		signatureService
			.getSignature({
				assinaturaId: assinaturaId!,
				accessToken: accessToken!,
			})
			.then((response) => {
				setData(response)
				const cpf =
					response.signatario.documento?.replace(/\D/g, '') ?? ''
				// Sincroniza com o store
				updateData({
					documentPDFUrl: response.documento.url,
					fullName: response.signatario.nome,
					cpf,
					dateOfBirth: response.signatario.nascimento
						? isoToBR(response.signatario.nascimento)
						: '',
				})
				// CPF vazio da API => campo editável (persiste entre os steps)
				setCpfEditable(!cpf)
				// Sincroniza os dados da empresa com o store
				setCompany({
					name: response.empresa.nome,
					cnpj: response.empresa.cnpj,
					logoUrl: response.empresa.logo_url,
				})
			})
			.catch((error: ApiError) => {
				setError(formatErrorMessage(error))
				setErrorCode(error.statusCode || null)
			})
			.finally(() => setLoading(false))
	}, [
		isValidParams,
		assinaturaId,
		accessToken,
		updateData,
		setCpfEditable,
		setCompany,
	])

	return { data, isLoading, error, errorCode }
}
