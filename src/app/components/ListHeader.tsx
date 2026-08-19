import { fontSize } from "@/constants/tokens"
import { defaultStyles } from "@/styles/styles"
import {Image as ExpoImage} from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { View, StyleSheet, Text, TextInput, ColorValue } from "react-native"
import Animated, { Extrapolation, interpolate, SharedValue, useAnimatedStyle } from "react-native-reanimated"
import SmartPlayButton from "./SmartPlayButton"
import { usePathname } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { FontAwesome } from "@expo/vector-icons"
import { useState } from "react"
import SmartShuffleButton from "./SmartShuffleButton"

type ListHeaderProps = {
    id: string
    tracks?: any
    principalColor: ColorValue
    principalImageUri?: string
    animatedImageSize?: any
    scrollY: SharedValue<number>
    isFocused?: boolean
    onChangeText?: (text: string) => void
    setIsFocused?: (focused: boolean) => void
}
const HEADER_MAX_HEIGHT = 500;
const HEADER_MIN_HEIGHT = 150;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const POST_SCROLL_DISTANCE = SCROLL_DISTANCE + 10

const MAIN_IMAGE_MAX_SIZE = 192
const MAIN_IMAGE_MIN_SIZE = 56

const ListHeader = ({
    id,
    tracks,
    principalColor,
    principalImageUri,
    scrollY,
    onChangeText,
}: ListHeaderProps) => {

    const pathname = usePathname();
    const isAlbumScreen = pathname === `/albums/`;

    const insets = useSafeAreaInsets()

    const [isFocused, setIsFocused] = useState(false);

    const animatedImageSize = useAnimatedStyle(() => {
        // OPTIMIZACIÓN DE FPS: Calculamos la escala en lugar de cambiar width/height
        const scale = interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE],
            [1, MAIN_IMAGE_MIN_SIZE / MAIN_IMAGE_MAX_SIZE], // Va de 1 (100%) a ~0.29 (29%)
            Extrapolation.CLAMP,
        );

        const imageTranslateY = interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE],
            [0, SCROLL_DISTANCE/2],
            Extrapolation.CLAMP,
        );

        const imageOpacity = interpolate(
            scrollY.value,
            [SCROLL_DISTANCE, POST_SCROLL_DISTANCE],
            [1, 0],
            Extrapolation.CLAMP,
        );

        return {
            opacity: imageOpacity,
            // Aplicamos scale y translateY en el mismo array de transform
            transform: [
                { translateY: imageTranslateY },
                { scale: scale } 
            ],
        };
    });

        
    return (
        <LinearGradient style={[defaultStyles.container, styles.topView, {paddingTop: insets.top, height: 500 + insets.top}]}
            colors={[principalColor, "#000000"]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}>
            <Animated.View style={[{...styles.coverImageTextContainer}, animatedImageSize]}>
                <ExpoImage source={{ 
                    uri: principalImageUri
                }}
                style={styles.coverImage} />
                { isAlbumScreen ? <Text style={[styles.titleText, {color: "white", position: "absolute", top: 220, fontSize: fontSize.lg}]}>{id}</Text> : null}
            </Animated.View>
            <View style={styles.utilsContainer}>
                <SmartShuffleButton style={{paddingHorizontal: 15}} iconSize={30}/>
                <View style={styles.textInputContainer}>
                    <FontAwesome name="search" size={18} color="white" style={{paddingRight: 4}}/>
                    <TextInput
                        style={[styles.inputText, isFocused && styles.inputTextFocused]}
                        placeholder="Buscar en la lista"
                        placeholderTextColor={"#7a7a7a"}
                        onChangeText={onChangeText}
                        onFocus={() => setIsFocused?.(true)}
                        onBlur={() => setIsFocused?.(false)}
                    />
                </View>
                <SmartPlayButton 
                    id={id} 
                    tracks={tracks}
                />
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    topView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        left: 0,
        right: 0,
        height: 500,
        backgroundColor: "transparent"
    },
    titleText: {
            fontSize: fontSize.base,
            fontWeight: 'bold', // Spotify usa fuentes de peso medio para los títulos
        },
    coverImageTextContainer: {
        display: "flex",
        alignItems: "center",
        marginTop: "auto",
    },
    coverImage: {
        width: 192,
        height: 192,
        borderRadius: 4, // Bordes ligeramente redondeados tipo Spotify
        backgroundColor: 'transparent', // Color de carga de fondo por si la imagen tarda 
    },
    utilsContainer: {
        flexDirection: "row",
        width: "auto",
        marginTop: "auto",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    textInputContainer: {
        backgroundColor: '#ffffff10',
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 6,
        paddingHorizontal: 6,
        width: "62%"
    },
    inputText: {
        height: 36,
        fontSize: 16,
        color: '#ffffff', // Texto casi negro, más suave
        borderRadius: 4,
        paddingVertical: 8,
        backgroundColor: 'transparent',
        width:"90%"
    },
    inputTextFocused: {
    },
    backButton: {
        position: "absolute",
        zIndex: 102,
        left: 18
    },
    showDisplay: {
        display: "none",
    }
})

export default ListHeader