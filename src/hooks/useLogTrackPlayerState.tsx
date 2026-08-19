import TrackPlayer, { Event } from "@rntp/player";

export const useLogTrackPlayerState = () => {
    TrackPlayer.addEventListener(Event.PlaybackError, async (event) => {
        console.warn("An error occurred: ", event)
    })

    TrackPlayer.addEventListener(Event.PlaybackStateChanged, async (event) => {
        console.warn("Playback state: ", event.state)
    })

    TrackPlayer.addEventListener(Event.MediaItemTransition, async (event) => {
        console.warn("Track changed: ", event.index)
    })
}