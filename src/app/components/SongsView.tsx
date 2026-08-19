import { defaultStyles } from "@/styles/styles";
import { View, StyleSheet, ColorValue, StyleProp, ImageStyle, Pressable } from "react-native";
import TrackList from "@/app/components/TrackList";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { fontSize, tabBarToContentMargin } from "@/constants/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from "react";
import { MediaItem } from "@rntp/player";
import { useRouter, usePathname } from "expo-router";
import ListHeader from "./ListHeader";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HEADER_MAX_HEIGHT = 500;
const HEADER_MIN_HEIGHT = 150;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const POST_SCROLL_DISTANCE = SCROLL_DISTANCE + 10

type SongViewProps = {
    id: string;
    tracks?: MediaItem[];
    principalColor: ColorValue;
    principalImageUri: string;
    headerTitle: string;
    styleImage?: StyleProp<ImageStyle>
}; 

export default function SongsView({ id, tracks = [], principalColor, principalImageUri, headerTitle}: SongViewProps){

    const pathname = usePathname();
    const isAlbumScreen = pathname === `/albums/${id}`;

    const router = useRouter(); // 2. Inicializa el router

    const insets = useSafeAreaInsets()

    const [text, onChangeText] = useState('');

    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
        },
    });

    const filteredTracks = useMemo(() => {
        if (!text) return tracks;
        return tracks.filter(u => u.title?.toLowerCase().includes(text.toLowerCase()));
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
                tracks={filteredTracks}
                id={id}
                style={{paddingBottom: tabBarToContentMargin.bottomPaddingMiniPlayer + insets.bottom}}
                onScroll={scrollHandler}
                ListHeaderComponent={
                    <ListHeader id={id} tracks={tracks} principalColor={principalColor} principalImageUri={principalImageUri} scrollY={scrollY} onChangeText={onChangeText}/>
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