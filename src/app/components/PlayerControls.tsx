import { colors } from "@/constants/tokens"
import { defaultStyles } from "@/styles/styles"
import { Ionicons } from "@expo/vector-icons"
import TrackPlayer, { useIsPlaying } from "@rntp/player"
import { StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from "react-native"
import PlayerRepeatToggle from "./PlayerRepeatToggle"
import SmartShuffleButton from "./SmartShuffleButton"

type PlayerControlsProps = {
    style?: ViewStyle
}

type PlayerButtonProps = {
    style?: ViewStyle
    iconSize?: number
}

export const PlayerControls = ({style}: PlayerControlsProps) => {
    return (
        <View style={[defaultStyles.container, style]}>
            <View style={[styles.row, {justifyContent: "space-between"}]}>
                <PlayerRepeatToggle size={28}/>
                <View style={[styles.row, {width: "60%"}]}>
                    <SkipToPreviousButton iconSize={40}/>
                    <MiniPlayButton iconSize={60}/>
                    <SkipToNextButton iconSize={40}/>
                </View>
                <SmartShuffleButton iconSize={28}/>
            </View>
        </View>
    )
}

export const MiniPlayButton = ({style, iconSize = 30}: PlayerButtonProps) => {
    const playing = useIsPlaying()

    return (
        <TouchableWithoutFeedback style={[{alignItems:"center"}, style]} onPress={() => playing ? TrackPlayer.pause() : TrackPlayer.play()}>
            <Ionicons name={playing ? "pause" : "play"} size={iconSize} color="white" />
        </TouchableWithoutFeedback>
    );
}

export const SkipToNextButton = ({ iconSize = 30 }: PlayerButtonProps) => {
	return (
		<TouchableWithoutFeedback  onPress={() => TrackPlayer.skipToNext()}>
			<Ionicons name="play-skip-forward" size={iconSize} color={colors.text} />
		</TouchableWithoutFeedback>
	)
}

export const SkipToPreviousButton = ({ iconSize = 30 }: PlayerButtonProps) => {
	return (
		<TouchableWithoutFeedback onPress={() => TrackPlayer.skipToPrevious()}>
			<Ionicons name="play-skip-back" size={iconSize} color={colors.text} />
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
    row:{
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
})