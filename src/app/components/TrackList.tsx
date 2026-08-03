import { FlatList, ImageStyle, View, type StyleProp, type ViewStyle } from "react-native"
import TrackListCard from "./TrackListCard"

interface Track {
    title: string;
    artists: string;
    image_uri: string;
}

export default function TrackList({ style, dataJSON, styleImage }: { style?: StyleProp<ViewStyle>, dataJSON: Track[], styleImage?: StyleProp<ImageStyle>}){
    return <FlatList 
        data={dataJSON}
        style={style}
        ItemSeparatorComponent={<View></View>}
        renderItem={({item: song}) => {
            const track = {
                title: song.title,
                artists: song.artists,
                image: song.image_uri
            } as any

            return <TrackListCard song={track} styleImage={styleImage} />
        }}
    />
}