import { defaultStyles } from "@/styles/styles";
import { ScrollView, Text, View, StyleSheet, Image, ColorValue, ViewStyle, StyleProp, ImageStyle } from "react-native";
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
import { fontSize, tabBarToContentMargin } from "@/constants/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HEADER_MAX_HEIGHT = 500;
const HEADER_MIN_HEIGHT = 150;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const POST_SCROLL_DISTANCE = SCROLL_DISTANCE + 50

const MAIN_IMAGE_MAX_SIZE = 192
const MAIN_IMAGE_MIN_SIZE = 56

interface Track {
    title: string;
    artists: string;
    image_uri: string;
}

type SongViewProps = {
    dataJSON?: Track[];
    principalColor: ColorValue;
    principalImageUri: string;
    headerTitle: string;
    styleImage?: StyleProp<ImageStyle>
};

export default function SongView({ dataJSON = [], principalColor, principalImageUri, headerTitle, styleImage}: SongViewProps){

    const insets = useSafeAreaInsets()

    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
        },
    });

    const animatedHeaderStyle = useAnimatedStyle(() => {
        const headerOpacity = interpolate(
            scrollY.value,
            [POST_SCROLL_DISTANCE, POST_SCROLL_DISTANCE+50],
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
            [POST_SCROLL_DISTANCE, POST_SCROLL_DISTANCE+50],
            [0, 1],
            Extrapolation.CLAMP,
        );

        const textTranslateY = interpolate(
            scrollY.value,
            [POST_SCROLL_DISTANCE, POST_SCROLL_DISTANCE+50],
            [55, 0],
            Extrapolation.CLAMP,
        );

        return {
            opacity: textOpacity,
            transform: [{translateY: textTranslateY}]
        };
    });

    const animatedImageSize = useAnimatedStyle(() => {
        const imageSize = interpolate(
            scrollY.value,
            [0, SCROLL_DISTANCE],
            [MAIN_IMAGE_MAX_SIZE, MAIN_IMAGE_MIN_SIZE],
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
            height: imageSize,
            width: imageSize,
            transform: [{ translateY: imageTranslateY }],
            opacity: imageOpacity,
        };
    });

    return (
        <View style={defaultStyles.container}>
            <AnimatedLinearGradient style={[defaultStyles.container, styles.header, animatedHeaderStyle, {paddingTop: insets.top, height: 75 + insets.top}]}
                    colors={["#222222", "#202020"]}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}>
                    <Animated.Text style={[{...styles.titleText, color: "white", transform: [{translateY: 55}]}, animatedTextHeaderStyle]}>{headerTitle}</Animated.Text>
            </AnimatedLinearGradient>
            <Animated.ScrollView style={[defaultStyles.container, {paddingBottom: tabBarToContentMargin.bottomPadding_NO_MiniPlayer + insets.bottom}]}
                onScroll={scrollHandler}
                scrollEventThrottle={16}>
                <AnimatedLinearGradient style={[defaultStyles.container, styles.topView, {paddingTop: insets.top, height: 500 + insets.top}]}
                    colors={[principalColor, "#000000"]}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}>
                    <Animated.Image source={{ 
                                    uri: principalImageUri
                                }}
                                style={[{...styles.coverImage}, animatedImageSize]} />
                </AnimatedLinearGradient>
                <TrackList dataJSON={dataJSON} style={{paddingBottom: tabBarToContentMargin.bottomPadding_NO_MiniPlayer + insets.bottom}} styleImage={styleImage}/>
            </Animated.ScrollView>
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
        flex: 0,
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
    coverImage: {
        width: 192,
        height: 192,
        borderRadius: 4, // Bordes ligeramente redondeados tipo Spotify
        backgroundColor: 'transparent', // Color de carga de fondo por si la imagen tarda
    }
})