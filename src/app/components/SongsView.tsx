import { defaultStyles } from "@/styles/styles";
import { ScrollView, Text, View, StyleSheet, ColorValue, ViewStyle, StyleProp, ImageStyle, Pressable, TextInput } from "react-native";
import TrackList from "@/app/components/TrackList";
import { lglIconUri } from "@/constants/images";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { colors, fontSize, tabBarToContentMargin } from "@/constants/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from "react";
import useMusicPlayer from "@/music_service/playService";
import TrackPlayer, { MediaItem, PlaybackState, useActiveMediaItem, useIsPlaying, usePlaybackState } from "@rntp/player";
import { useRouter, usePathname } from "expo-router";
import {Image as ExpoImage} from "expo-image";
import SmartPlayButton from "./SmartPlayButton";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HEADER_MAX_HEIGHT = 500;
const HEADER_MIN_HEIGHT = 150;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const POST_SCROLL_DISTANCE = SCROLL_DISTANCE + 10

const MAIN_IMAGE_MAX_SIZE = 192
const MAIN_IMAGE_MIN_SIZE = 56

type SongViewProps = {
    contextId: string;
    dataJSON?: MediaItem[];
    principalColor: ColorValue;
    principalImageUri: string;
    headerTitle: string;
    styleImage?: StyleProp<ImageStyle>
};

    const SmartShuffleButton = () => {

        const toggleShuffle = useMusicPlayer(state => state.toggleShuffle);
        const isShuffle = useMusicPlayer(state => state.isShuffle);

        const colorIcon = isShuffle ? colors.primary : "white"

        const handlePress = () => {
            toggleShuffle()
            console.log(isShuffle)
        }

        return(
            <Pressable style={styles.iconPauseAndShuffle} onPress={handlePress}>
                <Ionicons name="shuffle" size={32} color={colorIcon} />
            </Pressable>
        )
    }

    

export default function SongsView({ contextId, dataJSON = [], principalColor, principalImageUri, headerTitle}: SongViewProps){

    const pathname = usePathname();
    const isAlbumScreen = pathname === `/albums/${contextId}`;

    const router = useRouter(); // 2. Inicializa el router

    const insets = useSafeAreaInsets()

    const [isFocused, setIsFocused] = useState(false);

    const [text, onChangeText] = useState('');

    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
        },
    });

    const filteredTracks = useMemo(() => {
        if (!text) return dataJSON;
        return dataJSON.filter(u => u.title?.toLowerCase().includes(text.toLowerCase()));
    }, [text]);

    const animatedHeaderStyle = useAnimatedStyle(() => {
        const headerOpacity = interpolate(
            scrollY.value,
            [POST_SCROLL_DISTANCE, POST_SCROLL_DISTANCE+35],
            [0, 1],
            Extrapolation.CLAMP,
        );

        return {
            opacity: headerOpacity
        };
    });

    const animatedTextHeaderStyle = useAnimatedStyle(() => {
        const textOpacity = interpolate(
            scrollY.value,
            [POST_SCROLL_DISTANCE, POST_SCROLL_DISTANCE+35],
            [0, 1],
            Extrapolation.CLAMP,
        );

        const textTranslateY = interpolate(
            scrollY.value,
            [POST_SCROLL_DISTANCE, POST_SCROLL_DISTANCE+35],
            [55, 0],
            Extrapolation.CLAMP,
        );

        return {
            opacity: textOpacity,
            transform: [{translateY: textTranslateY}]
        };
    });

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
        <View style={defaultStyles.container}>
            <Pressable onPress={() => router.back()} style={[styles.backButton, {top: insets.top - 14 + 75/2}, !isAlbumScreen ? styles.showDisplay : null]}><Ionicons name="arrow-back" size={28} color="white" /></Pressable>
            <AnimatedLinearGradient style={[defaultStyles.container, styles.header, animatedHeaderStyle, {paddingTop: insets.top, height: 75 + insets.top}]}
                    colors={["#222222", "#202020"]}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}>
                    <Animated.Text style={[{...styles.titleText, color: "white", transform: [{translateY: 55}]}, animatedTextHeaderStyle]}>{headerTitle}</Animated.Text>
            </AnimatedLinearGradient>
            <TrackList
                dataJSON={filteredTracks}
                contextId={contextId}
                style={{paddingBottom: tabBarToContentMargin.bottomPaddingMiniPlayer + insets.bottom}}
                onScroll={scrollHandler}
                ListHeaderComponent={
                    <LinearGradient style={[defaultStyles.container, styles.topView, {paddingTop: insets.top, height: 500 + insets.top}]}
                        colors={[principalColor, "#000000"]}
                        start={{x: 0, y: 0}}
                        end={{x: 0, y: 1}}>
                        <Animated.View style={[{...styles.coverImageTextContainer}, animatedImageSize]}>
                            <ExpoImage source={{ 
                                        uri: principalImageUri
                                    }}
                                    style={styles.coverImage} />
                            <Text style={[styles.titleText, {color: "white", position: "absolute", top: 220, fontSize: fontSize.lg}, !isAlbumScreen ? styles.showDisplay : null]}>{contextId}</Text>
                        </Animated.View>
                        <View style={styles.utilsContainer}>
                            <SmartShuffleButton/>
                            <View style={styles.textInputContainer}>
                                <FontAwesome name="search" size={18} color="white" style={{paddingRight: 4}}/>
                                <TextInput
                                    style={[styles.inputText, isFocused && styles.inputTextFocused]}
                                    placeholder="Buscar en la lista"
                                    placeholderTextColor={"#7a7a7a"}
                                    onChangeText={onChangeText}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    />
                            </View>
                            <SmartPlayButton 
                                contextId={contextId} 
                                tracks={dataJSON}
                            />
                        </View>
                    </LinearGradient>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 75,
        backgroundColor: "transparent",
        opacity: 0,
        overflow: "hidden",
    },
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
    iconPauseAndShuffle:{
        paddingHorizontal: 15
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