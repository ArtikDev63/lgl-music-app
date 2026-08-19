import { useEffect, useState } from 'react'
import { MediaItem, useActiveMediaItem } from '@rntp/player'

export const useLastActiveTrack = () => {
	const activeTrack = useActiveMediaItem()
	const [lastActiveTrack, setLastActiveTrack] = useState<MediaItem>()

	useEffect(() => {
		if (!activeTrack) return

		setLastActiveTrack(activeTrack)
	}, [activeTrack])

	return lastActiveTrack
}