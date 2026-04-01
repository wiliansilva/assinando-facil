import { zodResolver } from '@hookform/resolvers/zod'
import type { Resolver } from 'react-hook-form'
import { z } from 'zod'
import { useSignatureStore } from '../store/signature.store'
import type { SignatureData } from '../store/types'

export const schemasByStep = {
	read: z.object({
		fileReadingConfirmed: z.boolean().refine((val) => val === true, {
			message: 'Necessário confirmar para confinuar',
		}),
	}),

	confirm: z.object({
		fullName: z.string().nonempty('Campo obrigatório'),
		cpf: z.string().nonempty('Campo obrigatório'),
		dateOfBirth: z.string().nonempty('Campo obrigatório'),
		personalDataConfirmed: z.boolean().refine((val) => val === true, {
			message: 'Necessário confirmar para confinuar',
		}),
	}),

	document: z.object({
		documentFrontBase64: z.string().nonempty('Campo obrigatório'),
		documentBackBase64: z.string().nonempty('Campo obrigatório'),
	}),

	selfie: z.object({
		selfieBase64: z.string().nonempty('Campo obrigatório'),
	}),

	signature: z.object({}),

	token: z.object({}),
}

export const dynamicResolver: Resolver<SignatureData> = async (
	data,
	context,
	options,
) => {
	const step = useSignatureStore.getState().step
	const schema = schemasByStep[step]

	const resolver = zodResolver(schema) as Resolver<SignatureData>

	return resolver(data, context, options)
}
