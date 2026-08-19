// app/player.tsx
import { View, Text, StyleSheet, ActivityIndicator, TouchableHighlight, TouchableWithoutFeedback, ColorValue } from 'react-native';
import { useRouter } from 'expo-router';
import { useActiveMediaItem } from '@rntp/player';
import { colors } from '@/constants/tokens';
import { defaultStyles } from '@/styles/styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import {Image as ExpoImage} from "expo-image"
import { unknownTrackImageUri } from '@/constants/images';
import { LinearGradient } from 'expo-linear-gradient';
import {mezclarColoresHEX} from "@/helpers/colorMath"
import { PlayerControls } from './components/PlayerControls';
import { PlayerProgressBar } from './components/PlayerProgressBar';

export default function FullScreenPlayer() {
    const router = useRouter();

    const activeTrack = useActiveMediaItem();

    if(!activeTrack){
        <View style={[defaultStyles.container, {justifyContent: "center"}]}>
            <ActivityIndicator color={colors.primary}/>
        </View>
    }

    return (
        <LinearGradient
            colors={[activeTrack?.extras?.imageColor as ColorValue, mezclarColoresHEX(activeTrack?.extras?.imageColor, "#111111", 0.99)]}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 0.8}}
            style={[defaultStyles.container, styles.container]}
            >
            <View style={styles.headerContainer}>
                <TouchableWithoutFeedback onPress={() => router.back()}>
                    <FontAwesome name="angle-down" size={36} color="white" />
                </TouchableWithoutFeedback>
                <Text style={{color: colors.text}}>Reproduciendo...</Text>
                <TouchableWithoutFeedback onPress={undefined}>
                    <Entypo name="dots-three-vertical" size={24} color="white" />
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.playerContainer}>
                <View style={styles.imageContainer}>
                    <ExpoImage 
                        source={{uri: activeTrack?.artworkUrl?.toString() ?? unknownTrackImageUri}}
                        placeholder={unknownTrackImageUri}
                        placeholderContentFit='cover'
                        priority={"high"}
                        style={styles.coverImage}
                        />
                </View>
                <View style={styles.infoContainer}>
                    <View>
                        <Text style={styles.titleText} numberOfLines={1}>{activeTrack?.title}</Text>
                        <Text style={styles.artistText} numberOfLines={1}>{activeTrack?.artist}</Text>
                    </View>
                    <TouchableWithoutFeedback onPress={undefined}>
                        <FontAwesome name="heart-o" size={24} color="white" />
                    </TouchableWithoutFeedback>
                </View>
                <View style={{height: 40, marginTop: 36}}>
                    <PlayerProgressBar/>
                </View>
                <View>
                    <PlayerControls style={styles.playerControlContainer}/>
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', paddingTop: 50, backgroundColor: "#111111", paddingHorizontal: 22, },
    closeButton: { color: 'white', fontSize: 30, position: 'absolute', top: 50, left: 20 },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    playerContainer: {
        flex: 1,
        marginTop: 36,
    },
    imageContainer: {
        width: "100%"
    },
    coverImage: {
        objectFit: 'cover',
        aspectRatio: 1,
        width: "100%",
        borderRadius: 12
    },
    titleText: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.text,
        maxWidth: 320
        
    },
    artistText: { 
        fontSize: 14,
        marginTop: 3,
        color: colors.textMuted,
        maxWidth: 320
    },
    infoContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 36,
    },
    playerControlContainer: {
        backgroundColor: "transparent",
        marginTop: 36
    }
});