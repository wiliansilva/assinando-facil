import { useEffect, useState } from 'react'

type GeolocationStatus = 'loading' | 'success' | 'denied' | 'error'
type Coords = { latitude: string; longitude: string }

export function useGeolocation(skip = false) {
	const [status, setStatus] = useState<GeolocationStatus>(() => {
		if (skip) return 'success'
		if (!navigator.geolocation) return 'error'
		return 'loading'
	})
	const [coords, setCoords] = useState<Coords | null>(null)

	useEffect(() => {
		if (status !== 'loading') return

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setCoords({
					latitude: String(position.coords.latitude),
					longitude: String(position.coords.longitude),
				})
				setStatus('success')
			},
			(error) => {
				setStatus(
					error.code === error.PERMISSION_DENIED ? 'denied' : 'error',
				)
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
		)
	}, [status])

	return {
		status,
		coords,
		isLoading: status === 'loading',
		isDenied: status === 'denied',
		hasLocation: status === 'success',
	}
}
