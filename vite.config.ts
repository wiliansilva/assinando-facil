import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		host: true,
		hmr: {
			protocol: 'wss',
			host: 'plant-untimely-mortify.ngrok-free.dev',
			clientPort: 443,
		},
	},
})
