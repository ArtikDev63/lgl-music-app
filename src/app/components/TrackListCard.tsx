import { View, Text, Pressable, StyleSheet, StyleProp, ImageStyle, InteractionManager } from "react-native";
import { Image } from "expo-image";
import { unknownTrackImageUri } from "@/constants/images";
import { colors, fontSize } from "@/constants/tokens";
import useMusicPlayer from "@/music_service/playService";
import { memo, startTransition } from "react";
import { usePathname } from 'expo-router';
import { MediaItem, useActiveMediaItem } from "@rntp/player";

export type TrackListCardProps = {
    song: MediaItem;
    contextId: string;
    tracks: any[];
}

const TrackListCard = memo(({ song, contextId, tracks }: TrackListCardProps) =>  {

    return(
        <Pressable style={({ hovered, pressed }) => [
            styles.cardContainer,
            {backgroundColor: hovered || pressed ? '#161616' : "transparent"}
        ]} onPress={null}>
            <Image source={{ 
                uri: song.artworkUrl?.toString() ?? unknownTrackImageUri
            }}
            priority={"normal"}
            placeholder={unknownTrackImageUri}
            cachePolicy={"memory-disk"}
            style={[{...styles.coverImage}, false ? styles.styleImageDisplay: null]} />
            <View style={styles.textContainer}>
                <Text style={{...styles.titleText, color: false ? colors.primary: colors.text}} numberOfLines={1}>
                    {song.title}
                </Text>
                <Text style={{...styles.artistText, color: false ? colors.primaryMuted: colors.textMuted}} numberOfLines={1}>
                    {song.artist}
                </Text>
            </View>

            <View style={styles.endContainer}>

                <Pressable style={styles.iconButton}>
                    <Text style={styles.menuIcon}>⋮</Text>
                </Pressable>
            </View>

        </Pressable>
    )
})

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Fondo oscuro de fila, si quieres que resalte usa #181818
        paddingVertical: 8,
        paddingHorizontal: 10,
        width: '100%',
        borderRadius: 10,
        height: 64
    },
    coverImage: {
        width: 48,
        height: 48,
        borderRadius: 4, // Bordes ligeramente redondeados tipo Spotify
        backgroundColor: '#282828', // Color de carga de fondo por si la imagen tarda
    },
    textContainer: {
        flex: 1, // Crucial: toma todo el espacio del centro y frena antes de los iconos
        marginLeft: 12,
        justifyContent: 'center',
        paddingRight: 12,
    },
    titleText: {
        fontSize: fontSize.sm,
        fontWeight: '500', // Spotify usa fuentes de peso medio para los títulos
    },
    artistText: { // Gris claro tipográfico de Spotify
        fontSize: fontSize.xs,
        marginTop: 3,
    },
    endContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    iconButton: {
        padding: 8, // Área de toque aumentada para que sea fácil pulsar en el móvil
    },
    menuIcon: {
        color: '#B3B3B3',
        fontSize: fontSize.base,
    },
    styleImageDisplay: {
        display: "none"
    }
});

export default TrackListCard;