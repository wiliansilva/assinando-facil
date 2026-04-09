import type { SignatureData } from '../../../domain/types'
import { isoToBR } from '../../../utils/dates'
import type {
	SignatoryResponse,
	SignatureDocumentResponse,
} from '../services/types'

export function normalizeSignatoryToFormData(
	signatory: SignatoryResponse,
	document: SignatureDocumentResponse,
): Partial<SignatureData> {
	return {
		fullName: signatory.nome,
		cpf: signatory.documento.replace(/\D/g, ''),
		dateOfBirth: signatory.nascimento
			? isoToBR(signatory.nascimento)
			: signatory.nascimento,
		documentPDFUrl: document.url,
	}
}
