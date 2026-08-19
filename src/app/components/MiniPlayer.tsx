// src/app/components/MiniPlayer.tsx
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import {Image as ExpoImage} from 'expo-image';
import { unknownTrackImageUri } from '@/constants/images';
import { useActiveMediaItem, useProgress } from '@rntp/player';
import { MiniPlayButton } from './PlayerControls';
import { useLastActiveTrack } from '@/hooks/useLastActiveTrack';
import { useRouter } from 'expo-router';
import { Slider } from 'react-native-awesome-slider';
import { useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';


export default function MiniPlayer({style} : {style: ViewStyle}) {

    const router = useRouter()

    const activeTrack = useActiveMediaItem()
    const lastActiveTrack = useLastActiveTrack()

    const displayTrack = activeTrack ?? lastActiveTrack

    const { duration, position } = useProgress();
    const progress = useSharedValue(0);
    const min = useSharedValue(0);
    const max = useSharedValue(1);

    useEffect(() => {
        progress.value = duration > 0 ? position / duration : 0;
    }, [position, duration]);

    if(!displayTrack) return null;

    const handlePress = () => {
        router.navigate("/player")
    }

    return (
        <Pressable onPress={handlePress} style={[styles.container, style, {backgroundColor: displayTrack.extras?.imageColor as any ?? '#2A2A2A'}]}>
            <View style={[styles.content]}>
                {/* Imagen de la pista */}
                <ExpoImage style={styles.imagePlaceholder} source={{uri: displayTrack.artworkUrl?.toString() ?? unknownTrackImageUri}} placeholder={unknownTrackImageUri}/> 
                
                {/* Textos */}
                <View style={styles.textContainer}>
                    <Text style={styles.title} numberOfLines={1}>{displayTrack.title}</Text>
                    <Text style={styles.artist} numberOfLines={1}>{displayTrack.artist}</Text>
                </View>

                {/* Tu botón de Play/Pause que ya gestiona el estado nativo */}
                {/* <SmartPlayButton ... /> */}
                <MiniPlayButton style={styles.iconPause} iconSize={26}/>
            </View>
            <View style={styles.progressBarContainer} pointerEvents='none'>
                <Slider
                    progress={progress}
                    minimumValue={min}
                    maximumValue={max}
                    containerStyle={styles.progressBarContainer}
                    renderBubble={() => null}
                    renderThumb={() => null}
                    disableTrackFollow={true}
                    disableTrackPress={true}
                    theme={{
                        maximumTrackTintColor: '#ffffff66',
                        minimumTrackTintColor: '#ffffff99',
                    }}
                    />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
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
        marginHorizontal: 10,
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