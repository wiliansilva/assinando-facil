import { useCallback } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import type { SignatureData, SignatureStep } from '../../../domain/types'
import { useSignatureStore } from '../store/signature.store'
import { useSignSignature } from './useSignSignature'

// hooks/useSignatureSubmit.ts
export function useSignatureSubmit(
	steps: SignatureStep[],
	currentIndex: number,
	goNext: (() => void) | undefined,
	onLastStepStart?: () => void,
	onLastStepFailure?: () => void,
) {
	const updateData = useSignatureStore((s) => s.updateData)
	const { sign, loading } = useSignSignature()

	const handleSubmit = useCallback(
		(methods: UseFormReturn<SignatureData>) =>
			methods.handleSubmit(
				async (formData) => {
					updateData(formData)
					const isLastStep = currentIndex === steps.length - 1

					if (!isLastStep) {
						goNext?.()
						return
					}

					onLastStepStart?.()

					try {
						const response = await sign()
						if (response?.sucesso) {
							toast.success('Documento assinado com sucesso!')
						} else {
							toast.error(
								response?.mensagem_erro ??
									'Erro ao assinar o documento.',
							)
							onLastStepFailure?.()
						}
					} catch {
						toast.error('Erro ao assinar o documento.')
						onLastStepFailure?.()
					}
				},
				() =>
					toast.error(
						'Por favor, corrija os erros antes de avançar.',
					),
			)(),
		[
			currentIndex,
			steps.length,
			goNext,
			sign,
			updateData,
			onLastStepStart,
			onLastStepFailure,
		],
	)

	return { handleSubmit, isLoading: loading }
}
