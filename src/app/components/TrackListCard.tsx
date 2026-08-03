import { View, Text, Pressable, StyleSheet, StyleProp, ImageStyle } from "react-native";
import { Image } from "expo-image";
import { unknownTrackImageUri } from "@/constants/images";
import { colors, fontSize } from "@/constants/tokens";

export type TrackListCardProps = {
    song: { title: string; artists?: string; image?: string };
    styleImage?: StyleProp<ImageStyle>;
}

export default function TrackListCard({ song, styleImage }: TrackListCardProps) {

    const isActiveTrack = false

    return(
        <Pressable style={({ hovered, pressed }) => [
            styles.cardContainer,
            hovered && styles.cardHovered,
            pressed && styles.cardPressed
        ]} onPress={null}>

            <Image source={{ 
                uri: song.image ?? unknownTrackImageUri
             }}
             priority={"normal"}
             placeholder={unknownTrackImageUri}
             style={[{...styles.coverImage}, styleImage]} />

            <View style={styles.textContainer}>
                <Text style={{...styles.titleText, color: isActiveTrack ? colors.primary: colors.text}} numberOfLines={1}>
                    {song.title}
                </Text>
                <Text style={{...styles.artistText, color: isActiveTrack ? colors.primary: colors.textMuted}} numberOfLines={1}>
                    {song.artists}
                </Text>
            </View>

            <View style={styles.endContainer}>

                <Pressable style={styles.iconButton}>
                    <Text style={styles.menuIcon}>⋮</Text>
                </Pressable>
            </View>

        </Pressable>
    )
}

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
    cardHovered: {
        backgroundColor: '#161616',
    },
    cardPressed: {
        backgroundColor: '#161616',
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
});