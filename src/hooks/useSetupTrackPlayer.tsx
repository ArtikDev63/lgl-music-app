import { useEffect, useRef } from 'react'
import TrackPlayer, {PlayerCommand,} from '@rntp/player'

const setupPlayer = async () => {
	await TrackPlayer.setupPlayer({
		contentType: 'music',
		cache: {
			preloading: {
				window: 2,
			}
		},
		android: {
			taskRemovedBehavior: "stop",
			notification: {
				channelId: "Hey",
				channelName: "JC REYES",
				smallIcon: "../../assets/lgl_logo.png"
			}
		}
	})

	await TrackPlayer.setCommands({
        capabilities: [
            PlayerCommand.PlayPause,
            PlayerCommand.Next,
            PlayerCommand.Previous,
            PlayerCommand.Seek,
        ],
        backwardInterval: 15,
        forwardInterval: 30,
    })
}

export const useSetupTrackPlayer = ({ onLoad }: { onLoad?: () => void }) => {
	const isInitialized = useRef(false)

	useEffect(() => {
		if (isInitialized.current) return

		setupPlayer()
			.then(() => {
				isInitialized.current = true
				onLoad?.()
			})
			.catch((error) => {
				isInitialized.current = false
				console.error(error)
			})
	}, [onLoad])
}