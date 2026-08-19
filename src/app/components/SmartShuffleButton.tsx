import TrackPlayer, { PlaybackState, useActiveMediaItem, useIsPlaying, usePlaybackState } from '@rntp/player';
import React, { useEffect, useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/tokens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueueManager } from '@/store/userQueueManager';
// Asegúrate de importar tus hooks y componentes (Ionicons, etc.)

interface SmartShuffleButtonProps {
    style?: ViewStyle
    iconSize?: number
}

const SmartShuffleButton = ({style, iconSize}: SmartShuffleButtonProps) => {

        const isShuffle = useQueueManager(state => state.isShuffle);
        const toggleShuffle = useQueueManager(state => state.toggleShuffle);

        const colorIcon = isShuffle ? colors.primary : "white"

        const handlePress = () => {
            toggleShuffle()
        }

        return(
            <Pressable style={style} onPress={handlePress}>
                <MaterialCommunityIcons name="shuffle" size={iconSize} color={colorIcon} />
            </Pressable>
        )
    }

// 5. LA MAGIA ANTIS-SPAM: Exportar obligatoriamente con React.memo
export default React.memo(SmartShuffleButton);