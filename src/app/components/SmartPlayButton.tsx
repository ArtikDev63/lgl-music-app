import useMusicPlayer from '@/music_service/playService';
import { PlaybackState, useActiveMediaItem, useIsPlaying, usePlaybackState } from '@rntp/player';
import React, { useMemo } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '@/constants/tokens';
// Asegúrate de importar tus hooks y componentes (Ionicons, etc.)

interface SmartPlayButtonProps {
    contextId: string;
    tracks: any[];
}

const SmartPlayButton = ({
    contextId,
    tracks,
}: SmartPlayButtonProps) => {
    // 1. Suscripciones a estados
    const activeTrack = useMusicPlayer(state => state.currentTrack);
    const currentTrack = useActiveMediaItem() ?? activeTrack;
    const isPlaying = useIsPlaying();
    const playbackState = usePlaybackState()
    
    const playAlbum = useMusicPlayer((state) => state.playAlbum);
    const togglePlayPause = useMusicPlayer((state) => state.togglePlayPause);

    // 2. PROTECCIÓN Y MEMORIZACIÓN
    // Solo recalcula si el contextId o la canción actual cambian.
    // Además, protege contra valores nulos para evitar que la app crashee.
    const isThisAlbumPlaying = useMemo(() => {
        const trackContext = currentTrack?.extras?.contextId;
        
        // Si no hay contexto en la canción actual o no nos pasaron contextId, devolvemos false rápido
        if (!trackContext || !contextId) return false;
        
        return contextId.trim().toLowerCase() === trackContext.trim().toLowerCase();
    }, [contextId, currentTrack?.extras?.contextId]);

    // Ocultamos el log temporalmente (descoméntalo si necesitas depurar, ya no hará spam)
    // console.log("Calculado:", isThisAlbumPlaying, contextId, currentTrack?.extras?.contextId);
    
    // 3. Lógica visual
    const buttonIcon = isThisAlbumPlaying && (isPlaying || playbackState === PlaybackState.Buffering) ? "pause-circle" : "play-circle";

    const handlePress = () => {
        // 4. Usar setTimeout en RN es mucho más estable que requestIdleCallback
        // 50ms es suficiente para liberar el hilo visual antes de inyectar audio
        setTimeout(() => {
            if (isThisAlbumPlaying) { 
                togglePlayPause();
            } else {
                playAlbum(tracks, contextId);
            }
        }, 50); 
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