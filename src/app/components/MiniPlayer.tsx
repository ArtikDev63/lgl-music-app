// src/app/components/MiniPlayer.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import useMusicPlayer from '@/music_service/playService'; // Ajusta la ruta a tu Zustand
import {Image as ExpoImage} from 'expo-image';
import { unknownTrackImageUri } from '@/constants/images';
import { useActiveMediaItem, useIsPlaying, useProgress } from '@rntp/player';
import Ionicons from '@expo/vector-icons/Ionicons';

const SmartPlayButton = () => {
        // 1. Nos suscribimos de manera reactiva a Zustand
        const isPlaying = useIsPlaying()
        const togglePlayPause = useMusicPlayer((state) => state.togglePlayPause);
        
        // 3. El icono cambiará visualmente sin retrasos
        const buttonIcon = isPlaying ? "pause" : "play";

        const handlePress = () => {
            togglePlayPause()
        };

        return (
            <Pressable style={[styles.iconPause]} onPress={handlePress}>
                <Ionicons name={buttonIcon} size={26} color="white" />
            </Pressable>
        );
    };

export default function MiniPlayer() {
    const router = useRouter();
    // 1. Leemos el estado global para saber si hay una canción cargada
    
    // (Opcional: Si en tu estado guardas los datos de la pista actual, léelos aquí)
    const activeTrack = useMusicPlayer(state => state.currentTrack);
    const currentTrack = useActiveMediaItem() ?? activeTrack;

    // El hook nos da la posición actual y la duración total en segundos
    const { position, duration } = useProgress(); // Se actualiza cada 1000ms (1 segundo)

    // Calculamos el porcentaje (evitando dividir por cero cuando la canción carga)
    const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

    // 2. Si no hay contexto ni música, destruimos el componente (no se muestra)
    if (!currentTrack.extras?.contextId) return null;

    // 3. Cuando lo presionen, navegamos al modal que configuramos
    const handlePress = () => {
        router.push('/player' as any);
    };

    return (
        <Pressable onPress={handlePress} style={[styles.container, {backgroundColor: currentTrack.extras.imageColor}]}>
            <View style={[styles.content]}>
                {/* Imagen de la pista */}
                <ExpoImage style={styles.imagePlaceholder} source={{uri: currentTrack.artworkUrl ?? unknownTrackImageUri}} placeholder={unknownTrackImageUri}/> 
                
                {/* Textos */}
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
                    <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
                </View>

                {/* Tu botón de Play/Pause que ya gestiona el estado nativo */}
                {/* <SmartPlayButton ... /> */}
                <SmartPlayButton/>
            </View>
            <View style={[styles.progressBarContainer, styles.progressBar, { width: `${progressPercentage}%` } // Aquí ocurre la magia
                ]}></View>
            <View style={styles.progressBarContainer}></View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        // Lo elevamos para que no lo tape la barra de navegación de pestañas.
        // (En Expo las Tabs suelen medir unos 50-60px, ajusta este bottom)
        bottom: 80, 
        left: 10,
        right: 10,
        height: 60,
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 10,
        zIndex: 1000,
        overflow: "hidden"
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imagePlaceholder: {
        width: 42, height: 42, backgroundColor: 'gray', borderRadius: 4
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    title: { color: 'white', fontWeight: 'bold', fontSize: 14 },
    artist: { color: '#B3B3B3', fontSize: 12 },
    progressBarContainer: {
        position: "absolute",
        bottom: 0,
        marginHorizontal: 10,
        backgroundColor: "#dddcdc0e",
        width: "100%",
        height: 2,
    },
    progressBar : {
        backgroundColor: 'white',
    },
    iconPause: {
        padding: 4
    }
});