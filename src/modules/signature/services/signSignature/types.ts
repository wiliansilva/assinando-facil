import type { SignSignaturePayload } from '../../../../domain/types'

export type SignSignatureResponse = {
	sucesso: boolean
	mensagem_erro: string | null
	data_assinatura: string
}

export type SignSignatureParams = {
	assinaturaId: string
	contratoId: string
	payload: SignSignaturePayload
}
