import { zodResolver } from '@hookform/resolvers/zod'
import type { Resolver } from 'react-hook-form'
import { z } from 'zod'
import type { SignatureData } from '../../../domain/types'
import { isValidDateBR } from '../../../utils/dates'
import { useSignatureStore } from '../store/signature.store'

export const schemasByStep = {
	read: z.object({
		fileReadingConfirmed: z.boolean().refine((val) => val === true, {
			message: 'Necessário confirmar para confinuar',
		}),
	}),

	confirm: z.object({
		fullName: z.string().nonempty('Campo obrigatório!'),
		cpf: z.string().nonempty('Campo obrigatório!'),
		dateOfBirth: z
			.string()
			.nonempty('Campo obrigatório!')
			.min(8, 'Data incompleta!')
			.refine(isValidDateBR, 'Data inválida!'),

		personalDataConfirmed: z.boolean().refine((val) => val === true, {
			message: 'Necessário confirmar para confinuar!',
		}),
	}),

	document: z.object({
		documentFrontBase64: z.string().nonempty('Campo obrigatório!'),
		documentBackBase64: z.string().nonempty('Campo obrigatório!'),
	}),

	selfie: z.object({
		selfieBase64: z.string().nonempty('Campo obrigatório!'),
	}),

	signature: z.object({
		signatureBase64: z.string().nonempty('Campo obrigatório!'),
	}),

	token: z.object({
		token: z
			.string()
			.nonempty('Campo obrigatório!')
			.min(6, 'Token incompleto!'),
	}),
}

export const dynamicResolver: Resolver<SignatureData> = async (
	data,
	context,
	options,
) => {
	const step = useSignatureStore.getState().step
	if (!(step in schemasByStep)) {
		return { values: data, errors: {} }
	}
	const schema = schemasByStep[step as keyof typeof schemasByStep]

	const resolver = zodResolver(schema) as unknown as Resolver<SignatureData>

	return resolver(data, context, options)
}
