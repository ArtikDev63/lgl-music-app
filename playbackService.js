// playbackService.js
import TrackPlayer, { Event } from '@rntp/player';

export const PlaybackService = async function() {
    TrackPlayer.registerBackgroundEventHandler(() => async (event) => {
        if (event.type === Event.RemotePlay) TrackPlayer.play();
    });
    TrackPlayer.registerBackgroundEventHandler(() => async (event) => {
        if (event.type === Event.RemotePause) TrackPlayer.pause();
    });
    TrackPlayer.registerBackgroundEventHandler(() => async (event) => {
        if (event.type === Event.RemoteNext) TrackPlayer.skipToNext();
    });
    TrackPlayer.registerBackgroundEventHandler(() => async (event) => {
        if (event.type === Event.RemotePrevious) TrackPlayer.skipToPrevious();
    });
    TrackPlayer.registerBackgroundEventHandler(() => async (event) => {
        if (event.type === Event.RemoteStop) TrackPlayer.destroy();
    });
};