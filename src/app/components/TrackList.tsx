import { Dimensions, FlatList, ImageStyle, NativeScrollEvent, NativeSyntheticEvent, View, type StyleProp, type ViewStyle } from "react-native"
import TrackListCard from "./TrackListCard"
import Animated from "react-native-reanimated";
import { useCallback, type ComponentType, type ReactElement } from "react";
import { FlashList } from "@shopify/flash-list";
import { MediaItem, MediaUrl } from "@rntp/player";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<MediaItem>)

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HEADER_MAX_HEIGHT = 500;
const HEADER_MIN_HEIGHT = 150;
const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const POST_SCROLL_DISTANCE = SCROLL_DISTANCE + 10


interface Track {
    title: string;
    artist: string;
    artworkUrl: MediaUrl;
}

export default function TrackList({dataJSON, contextId ,onScroll, ListHeaderComponent, style }: { style?: StyleProp<ViewStyle>, dataJSON: MediaItem[], contextId: string,styleImage?: StyleProp<ImageStyle>, onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void, ListHeaderComponent?: ReactElement | ComponentType<any> | null}){

    const keyExtractor = useCallback((item: any, index: { toString: () => any; }) => {
        if (item.id) return item.id.toString();
        return `${item.title.toLowerCase().replace(/\s+/g, '-')}-${index}`;
    }, []);

    const flashListStyle = style as ViewStyle | undefined;

    return <AnimatedFlashList 
        data={dataJSON}
        keyExtractor={keyExtractor} // ID Único por fila
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
        renderItem={({ item: song }: { item: MediaItem }) => {

            return <TrackListCard song={song} contextId={contextId} tracks={dataJSON}/>
        }}
    />
}