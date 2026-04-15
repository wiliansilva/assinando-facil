import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { SignatureData, SignatureState } from '../../../domain/types'

export const initialData: SignatureData = {
	documentPDFUrl: '',
	fullName: '',
	cpf: '',
	dateOfBirth: '',
	documentFrontBase64: '',
	documentBackBase64: '',
	selfieBase64: '',
	signatureBase64: '',
	signatureType: 'drawed',
	token: '',
	latitude: '',
	longitude: '',
	fileReadingConfirmed: false,
	personalDataConfirmed: false,
	tokenSent: false,
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
				document: false,
				selfie: false,
				signature: false,
				token: false,
				success: true,
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

			reset: () => set({}),
		}),
		{
			name: 'signature-flow',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
)
