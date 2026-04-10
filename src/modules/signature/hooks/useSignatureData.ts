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
	const contratoId = searchParams.get('contrato')
	const { updateData } = useSignatureStore()

	const isValidParams = Boolean(assinaturaId && contratoId)

	const [data, setData] = useState<GetSignatureResponse | null>(null)
	const [isLoading, setLoading] = useState(isValidParams)
	const [error, setError] = useState<string | null>(
		isValidParams ? null : 'Parâmetros inválidos na URL.',
	)

	useEffect(() => {
		if (!isValidParams) return

		signatureService
			.getSignature({
				assinaturaId: assinaturaId!,
				contratoId: contratoId!,
			})
			.then((response) => {
				setData(response)
				// Sincroniza com o store
				updateData({
					documentPDFUrl: response.documento.url,
					fullName: response.signatario.nome,
					cpf: response.signatario.documento.replace(/\D/g, ''),
					dateOfBirth: response.signatario.nascimento
						? isoToBR(response.signatario.nascimento)
						: response.signatario.nascimento,
				})
			})
			.catch((error: ApiError) => {
				setError(formatErrorMessage(error))
			})
			.finally(() => setLoading(false))
	}, [isValidParams, assinaturaId, contratoId, updateData])

	return { data, isLoading, error }
}
