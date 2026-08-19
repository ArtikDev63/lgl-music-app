import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { Image } from "expo-image";
import { unknownTrackImageUri } from "@/constants/images";
import { colors, fontSize } from "@/constants/tokens";
import { LoaderKitView } from 'react-native-loader-kit';
import Entypo from '@expo/vector-icons/Entypo';
import { MediaItem, useActiveMediaItem, useIsPlaying } from "@rntp/player";
import TrackShortcutsMenu from "./TrackShortcutsMenu";
import StopPropagation from "./utils/StopPropagation";
import { defaultStyles } from "@/styles/styles";

export type TrackListCardProps = {
    track: MediaItem;
    onTrackSelect: (track: MediaItem) => void;
    onAddToQueue: (track: MediaItem) => void;
    isAlbumScreen?: boolean;
};

// 2. Micro-componente: Aísla la suscripción activa para que NO re-renderice la fila entera
const TrackStatusAndTitle = memo(({ track }: { track: MediaItem }) => {
    const activeItem = useActiveMediaItem();
    const playing = useIsPlaying();

    const isActive = activeItem?.url === track.url;
    const isCurrentlyPlaying = isActive && playing;

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isCurrentlyPlaying ? (
                <LoaderKitView 
                    style={styles.trackPlayingIndicator} 
                    name="LineScaleParty" 
                    color={colors.primary} 
                />
            ) : null}
            <Text 
                style={[styles.titleText, { color: isActive ? colors.primary : colors.text }]} 
                numberOfLines={1}
            >
                {track.title}
            </Text>
        </View>
    );
});

const TrackListCard = memo(({ 
    track, 
    onTrackSelect: handleTrackSelect,
    onAddToQueue: handleAddQueue,
    isAlbumScreen = false,
}: TrackListCardProps) => {

    return (
            <View>
            <TouchableHighlight 
                underlayColor="#1E1E1E"
                onPress={() => handleTrackSelect(track)}
            >
                <View style={styles.cardContainer}>
                    {!isAlbumScreen ? (
                        <Image 
                            source={{ uri: track.artworkUrl?.toString() ?? unknownTrackImageUri }}
                            recyclingKey={track.url.toString()}
                            priority="low"
                            placeholder={unknownTrackImageUri}
                            cachePolicy="memory-disk"
                            style={styles.coverImage} 
                        />
                    ) : null}
                    
                    <View style={styles.textContainer}>
                        <TrackStatusAndTitle track={track} />
                        <Text style={styles.artistText} numberOfLines={1}>
                            {track.artist}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
            <TrackShortcutsMenu track={track} onAddToQueue={() => handleAddQueue(track)} style={styles.iconButton}>
                                <Entypo name="dots-three-vertical" size={16} color={colors.text} style={styles.menuIcon}/>
            </TrackShortcutsMenu>
            </View>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps.track.url === nextProps.track.url &&
        prevProps.isAlbumScreen === nextProps.isAlbumScreen
    );
});

const styles = StyleSheet.create({
    swipeContainer: {
        backgroundColor: '#1E3264',
        overflow: 'hidden',
    },
    leftActionContainer: {
        width: 65,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        paddingVertical: 8,
        paddingHorizontal: 10,
        width: '90%',
        height: 64,
        backgroundColor: colors.background,
    },
    trackPlayingIndicator: {
        width: 14,
        height: 14,
        marginRight: 5,
    },
    coverImage: {
        width: 48,
        height: 48,
        borderRadius: 4, 
        backgroundColor: '#282828', 
    },
    textContainer: {
        flex: 1, 
        marginLeft: 12,
        justifyContent: 'center',
        paddingRight: 12,
    },
    titleText: {
        fontSize: fontSize.sm,
        fontWeight: '500', 
    },
    artistText: { 
        fontSize: fontSize.xs,
        marginTop: 3,
        color: colors.textMuted,
    },
    endContainer: {
        flexDirection: 'row',
        justifyContent: "center",
        marginLeft: 8,
    },
    iconButton: {
        position: "absolute",
        right: 0,
        flexDirection: 'row',
        alignItems: "center",
        marginLeft: 8,
        paddingHorizontal: 8,
        height: "100%"
    },
    menuIcon: {
        color: '#B3B3B3',
        fontSize: fontSize.base,
        marginHorizontal: 8,
    },
});

export default TrackListCard;