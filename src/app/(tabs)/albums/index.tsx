import AlbumList from "@/app/components/AlbumList";
import { fontSize } from "@/constants/tokens";
import { defaultStyles } from "@/styles/styles";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AlbumScreen() {

    const insets = useSafeAreaInsets()

    return (
        <View style={defaultStyles.container}>
            <LinearGradient style={[defaultStyles.container, styles.header, {paddingTop: insets.top, height: 75 + insets.top}]}
                colors={["#222222", "#202020"]}
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}>
                <Text style={{...styles.titleText, color: "white"}}>ALBUMS</Text>
            </LinearGradient>
            <AlbumList/>
        </View>
    );

};

const styles = StyleSheet.create({
    header: {
        flex: 0,
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 75,
        backgroundColor: "transparent",
        overflow: "hidden"
    },
    titleText: {
        fontSize: fontSize.base,
        fontWeight: 'bold', // Spotify usa fuentes de peso medio para los títulos
    },
    coverImage: {
        width: 192,
        height: 192,
        borderRadius: 4, // Bordes ligeramente redondeados tipo Spotify
        backgroundColor: 'transparent', // Color de carga de fondo por si la imagen tarda
    },
    albumContainer: {
        paddingTop: 16, 
    }
})