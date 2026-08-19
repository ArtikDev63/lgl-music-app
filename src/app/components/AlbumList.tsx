import { Dimensions, View, type ViewStyle } from "react-native"
import { useAlbums } from "@/hooks/getLibraryData";
import AlbumListCard from "./AlbumListCard"
import { FlashList } from "@shopify/flash-list";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AlbumList({ style }: { style?: ViewStyle }){

    const { albums } = useAlbums();

    return <FlashList 
        data={albums}
        style={style}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={View}
        contentContainerStyle={[
        style,
        {
            minHeight: SCREEN_HEIGHT - 75
        }
        ]}
        renderItem={({item: album}) => <AlbumListCard album={{
            title: album.title,
            anyo: album.anyo,
            image: album.image_uri
        }}/>}
    />
}