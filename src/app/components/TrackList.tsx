import { Dimensions, ImageStyle, NativeScrollEvent, NativeSyntheticEvent, View, type StyleProp, type ViewStyle } from "react-native"
import TrackListCard from "./TrackListCard"
import Animated from "react-native-reanimated";
import { useRef, type ComponentType, type ReactElement } from "react";
import { FlashList } from "@shopify/flash-list";
import TrackPlayer, { MediaItem } from "@rntp/player";
import { useQueueManager } from "@/store/userQueueManager";
import { usePathname } from "expo-router";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<MediaItem>)

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HEADER_MAX_HEIGHT = 500;
const HEADER_MIN_HEIGHT = 150;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const POST_SCROLL_DISTANCE = SCROLL_DISTANCE + 10

export default function TrackList({id, tracks, onScroll, ListHeaderComponent, style }: { style?: StyleProp<ViewStyle>, tracks: MediaItem[], id: string, styleImage?: StyleProp<ImageStyle>, onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void, ListHeaderComponent?: ReactElement | ComponentType<any> | null}){

    const pathname = usePathname();
    const isAlbumScreen = pathname === `/albums/${id}`;

    const queueOffset = useRef(0)

    const loadQueue = useQueueManager(state => state.loadQueue);
    const activeQueueId = useQueueManager(state => state.activeQueueId);
    const addToNextQueue = useQueueManager((state) => state.addToNextInQueue);

    const handleTrackSelect = async (selectedTrack: MediaItem) => {
        
        const trackIndex = tracks.findIndex((track: any) => track.url === selectedTrack.url)

        if (trackIndex === -1) return

        const isChangingQueue = id !== activeQueueId

        if (isChangingQueue) {
			await loadQueue(tracks, trackIndex, id);
		} else {
            
            const trackIndex = await TrackPlayer.getQueue().findIndex((track: any) => track.url === selectedTrack.url)

			const nextTrackIndex =
				trackIndex - queueOffset.current < 0
					? tracks.length + trackIndex - queueOffset.current
					: trackIndex - queueOffset.current

			await TrackPlayer.skipToIndex(nextTrackIndex)
			TrackPlayer.play()
		}
    };

    const handleAddQueue = async(selectedTrack: MediaItem) => {
        console.log("Estoy aqui")
        if(!selectedTrack) return

        addToNextQueue(selectedTrack);
        console.log("Añadido a la cola la cancion:", selectedTrack.title)
    }

    const flashListStyle = style as ViewStyle | undefined;

    return <AnimatedFlashList 
        data={tracks}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={ListHeaderComponent}
        style={flashListStyle}
        ItemSeparatorComponent={() => <View />}
        contentContainerStyle={[
        style,
        {
            minHeight: SCREEN_HEIGHT + POST_SCROLL_DISTANCE + 51
        }
        ]}
        renderItem={({ item: track }: { item: MediaItem }) => {

            return <TrackListCard track={track} onTrackSelect={handleTrackSelect} onAddToQueue={handleAddQueue} isAlbumScreen={isAlbumScreen}/>
        }}
    />
}