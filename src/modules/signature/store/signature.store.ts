import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { SignatureData, SignatureState } from './types'

export const initialData: SignatureData = {
	fullName: '',
	cpf: '',
	dateOfBirth: '',
	documentFrontUrl: '',
	documentBackUrl: '',
	selfieUrl: '',
	signatureImage: '',
	token: '',
	fileReadingConfirmed: false,
	personalDataConfirmed: false,
}

export const useSignatureStore = create<SignatureState>()(
	persist(
		(set, get) => ({
			step: 'read',
			data: initialData,

			setStep: (step) => set({ step }),

			updateData: (newData) =>
				set((state) => ({
					data: { ...state.data, ...newData },
				})),

			availableSteps: [],

			setAvailableSteps: (availableSteps) => set({ availableSteps }),

			validByStep: {
				read: false,
				confirm: false,
				document: true,
				selfie: true,
				signature: true,
				token: true,
			},

			setStepValid: (step, valid) =>
				set((state) => ({
					validByStep: {
						...state.validByStep,
						[step]: valid,
					},
				})),

			isCurrentStepValid: () => {
				const { step, validByStep } = get()
				return validByStep[step]
			},

			reset: () => set({ step: 'read', data: initialData }),
		}),
		{
			name: 'signature-flow',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
)
