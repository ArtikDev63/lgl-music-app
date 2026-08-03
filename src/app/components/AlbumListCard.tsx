import { unknownTrackImageUri } from "@/constants/images";
import { colors, fontSize } from "@/constants/tokens";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {Image} from "expo-image";
import {useRouter} from "expo-router"

export type AlbumListCardProps = {
    album: {title: string; anyo?: number; image?: string}
}

export default function AlbumListCard({album}: AlbumListCardProps){

    const isActiveTrack = false

    const router = useRouter(); // 2. Inicializa el router

    return (
        <Pressable style={({ hovered, pressed }) => [
            styles.cardContainer,
            hovered && styles.cardHovered,
            pressed && styles.cardPressed
        ]} onPress={() => router.push(`/(tabs)/albums/${album.title}`)}>

            <Image source={{ 
                    uri: album.image ?? unknownTrackImageUri
                }}
                priority={"normal"}
                placeholder={unknownTrackImageUri}
                style={{...styles.coverImage}} />

            <View style={styles.textContainer}>
                <Text style={{...styles.titleText, color: isActiveTrack ? colors.primary: colors.text}} numberOfLines={1}>
                    {album.title}
                </Text>
                <Text style={{...styles.artistText, color: isActiveTrack ? colors.primary: colors.textMuted}} numberOfLines={1}>
                    {album.anyo}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Fondo oscuro de fila, si quieres que resalte usa #181818
        paddingVertical: 8,
        paddingHorizontal: 10,
        width: '100%',
        borderRadius: 10,
    },
    cardHovered: {
        backgroundColor: '#161616',
    },
    cardPressed: {
        backgroundColor: '#161616',
    },
    coverImage: {
        width: 96,
        height: 96,
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
})