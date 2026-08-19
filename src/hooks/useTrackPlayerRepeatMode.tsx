import { useCallback, useEffect, useState } from 'react'
import TrackPlayer, { RepeatMode } from '@rntp/player'

export const useTrackPlayerRepeatMode = () => {
	const [repeatMode, setRepeatMode] = useState<RepeatMode>()

	const changeRepeatMode = useCallback(async (repeatMode: RepeatMode) => {
		await TrackPlayer.setRepeatMode(repeatMode)

		setRepeatMode(repeatMode)
	}, [])

	useEffect(() => {
		setRepeatMode(TrackPlayer.getRepeatMode())
	}, [])

	return { repeatMode, changeRepeatMode }
}