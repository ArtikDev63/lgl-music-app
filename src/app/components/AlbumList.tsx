import { View, type ViewStyle } from "react-native"
import dataAlbums from "@/assets/data/albums_json.json"
import AlbumListCard from "./AlbumListCard"
import { FlashList } from "@shopify/flash-list";

export default function AlbumList({ style }: { style?: ViewStyle }){
    return <FlashList 
        data={dataAlbums}
        style={style}
        ItemSeparatorComponent={View}
        renderItem={({item: album}) => <AlbumListCard album={{
            title: album.title,
            anyo: album.anyo,
            image: album.image_uri
        }}/>}
    />
}