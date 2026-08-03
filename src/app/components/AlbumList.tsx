import { FlatList, View, type StyleProp, type ViewStyle } from "react-native"
import dataAlbums from "@/assets/data/albums_json.json"
import AlbumListCard from "./AlbumListCard"

export default function AlbumList({ style }: { style?: StyleProp<ViewStyle> }){
    return <FlatList 
        data={dataAlbums}
        style={style}
        ItemSeparatorComponent={<View></View>}
        renderItem={({item: album}) => <AlbumListCard album={{
            title: album.title,
            anyo: album.anyo,
            image: album.image_uri
        }}/>}
    />
}