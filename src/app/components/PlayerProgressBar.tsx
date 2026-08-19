import { colors, fontSize } from "@/constants/tokens";
import { formatSecondsToMinutes } from "@/helpers/miscellaneous";
import { defaultStyles, utilsStyles } from "@/styles/styles";
import TrackPlayer, { useProgress } from "@rntp/player";
import { useEffect } from "react"; // 👈 Importamos useEffect
import { View, ViewProps, StyleSheet, Text } from "react-native";
import { Slider } from "react-native-awesome-slider";
import { useSharedValue } from "react-native-reanimated";

export const PlayerProgressBar = ({ style }: ViewProps) => {
    const { duration, position } = useProgress();

    const isSliding = useSharedValue(false);
    const progress = useSharedValue(0);
    const min = useSharedValue(0);
    const max = useSharedValue(1);

    const trackElapsedTime = formatSecondsToMinutes(position);
    const trackRemainingTime = formatSecondsToMinutes(duration);

    // 👈 Sincronizamos el progreso de forma segura usando un useEffect
    useEffect(() => {
        if (!isSliding.value) {
            progress.value = duration > 0 ? position / duration : 0;
        }
    }, [position, duration]);

    return (
        <View style={style}>
            {/* 👈 Pasamos los Shared Values directamente (sin .get()) */}
            <Slider 
                progress={progress} 
                minimumValue={min} 
                maximumValue={max}
                containerStyle={utilsStyles.slider}
                thumbWidth={0}
                renderBubble={() => null}
                theme={{
                    maximumTrackTintColor: 'rgba(255,255,255,0.4)',
	                minimumTrackTintColor: 'rgba(255,255,255,0.6)',
                }}
                onSlidingStart={() => {
                    isSliding.value = true;
                }}
                onValueChange={async (value) => {
                    await TrackPlayer.seekTo(value * duration);
                }}
                onSlidingComplete={async (value) => {
                    if (!isSliding.value) return;

                    isSliding.value = false;
                    await TrackPlayer.seekTo(value * duration);
                }}
            />
            <View style={styles.timeRow}>
                <Text style={styles.timeText}>{trackElapsedTime}</Text>
                <Text style={styles.timeText}>
                    {trackRemainingTime}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginTop: 20,
    },
    timeText: {
        ...defaultStyles.text,
        color: colors.text,
        opacity: 0.75,
        fontSize: fontSize.xs,
        letterSpacing: 0.7,
        fontWeight: '500',
    },
});
