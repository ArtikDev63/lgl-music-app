import TrackPlayer, { PlaybackState, useActiveMediaItem, useIsPlaying, usePlaybackState } from '@rntp/player';
import React, { useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '@/constants/tokens';
import { useQueue } from "@/store/queue";
import { isPlaying } from 'node_modules/@rntp/player/src/audio';
import { useQueueManager } from '@/store/userQueueManager';

interface SmartPlayButtonProps {
    id: string;
    tracks: any[];
}

const SmartPlayButton = ({
    id,
    tracks,
}: SmartPlayButtonProps) => {
   
    const playing = useIsPlaying()
    const loadQueue = useQueueManager(state => state.loadQueue);
    const activeQueueId = useQueueManager(state => state.activeQueueId);

    const currentIdPlaylist = activeQueueId === id

    const buttonIcon = playing && currentIdPlaylist ? "pause-circle" : "play-circle";

    const handlePress = async() => {

        if(!tracks) return null

        if(currentIdPlaylist){
            playing ? TrackPlayer.pause() : TrackPlayer.play()
        } else {
            await loadQueue(tracks, 0, id);
        }

    };

    return (
        <Pressable style={styles.iconPauseAndShuffle} onPress={handlePress}>
            <Ionicons name={buttonIcon} size={56} color={colors.primary} />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    iconPauseAndShuffle:{
        paddingHorizontal: 15
    },
})

// 5. LA MAGIA ANTIS-SPAM: Exportar obligatoriamente con React.memo
export default React.memo(SmartPlayButton);