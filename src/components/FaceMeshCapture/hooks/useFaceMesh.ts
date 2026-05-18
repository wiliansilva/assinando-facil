import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

const WASM_CDN =
	'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm'
const MODEL_URL =
	'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

export function useFaceMesh(
	videoRef: React.RefObject<HTMLVideoElement | null>,
) {
	const landmarkerRef = useRef<FaceLandmarker | null>(null)
	const rafIdRef = useRef<number>(0)
	const isActiveRef = useRef(true)
	const lastVideoTimeRef = useRef(-1)

	const [isReady, setIsReady] = useState(false)
	const [landmarks, setLandmarks] = useState<NormalizedLandmark[] | null>(
		null,
	)

	useEffect(() => {
		isActiveRef.current = true

		async function init() {
			try {
				const fileset = await FilesetResolver.forVisionTasks(WASM_CDN)
				const landmarker = await FaceLandmarker.createFromOptions(
					fileset,
					{
						baseOptions: {
							modelAssetPath: MODEL_URL,
							delegate: 'GPU',
						},
						runningMode: 'VIDEO',
						numFaces: 1,
					},
				)
				if (!isActiveRef.current) {
					landmarker.close()
					return
				}
				landmarkerRef.current = landmarker
				setIsReady(true)
			} catch {
				// GPU unavailable — retry with CPU
				try {
					const fileset =
						await FilesetResolver.forVisionTasks(WASM_CDN)
					const landmarker = await FaceLandmarker.createFromOptions(
						fileset,
						{
							baseOptions: {
								modelAssetPath: MODEL_URL,
								delegate: 'CPU',
							},
							runningMode: 'VIDEO',
							numFaces: 1,
						},
					)
					if (!isActiveRef.current) {
						landmarker.close()
						return
					}
					landmarkerRef.current = landmarker
					setIsReady(true)
				} catch {
					// Face detection unavailable; camera still works with manual capture
				}
			}
		}

		init()

		const runLoop = () => {
			if (!isActiveRef.current) return
			const video = videoRef.current
			const landmarker = landmarkerRef.current

			if (landmarker && video && video.readyState >= 2) {
				const now = video.currentTime
				if (now !== lastVideoTimeRef.current) {
					lastVideoTimeRef.current = now
					const result = landmarker.detectForVideo(
						video,
						performance.now(),
					)

					const face = result.faceLandmarks?.[0]
					setLandmarks(face && face.length > 0 ? face : null)
				}
			}

			rafIdRef.current = requestAnimationFrame(runLoop)
		}
		rafIdRef.current = requestAnimationFrame(runLoop)

		return () => {
			isActiveRef.current = false
			cancelAnimationFrame(rafIdRef.current)
			landmarkerRef.current?.close()
			landmarkerRef.current = null
		}
	}, [videoRef])

	return { isReady, landmarks, faceDetected: landmarks !== null }
}
