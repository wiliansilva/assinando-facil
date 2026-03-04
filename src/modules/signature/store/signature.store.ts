import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SignatureData, SignatureStep } from '../domain/types'

type SignatureState = {
	step: SignatureStep
	data: SignatureData
	setStep: (step: SignatureStep) => void
	updateData: (data: Partial<SignatureData>) => void
	reset: () => void
}

const initialData: SignatureData = {
	fullName: '',
	cpf: '',
	email: '',
	phone: '',
}

export const useSignatureStore = create<SignatureState>()(
	persist(
		(set) => ({
			step: 'read',
			data: initialData,

			setStep: (step) => set({ step }),

			updateData: (newData) =>
				set((state) => ({
					data: { ...state.data, ...newData },
				})),

			reset: () => set({ step: 'read', data: initialData }),
		}),
		{
			name: 'signature-flow',
		},
	),
)
