import SongView from "@/app/components/SongsView"
import { useAlbums, useTracks } from "@/hooks/getLibraryData";
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react";
import { getColors } from "react-native-image-colors";

export default function AlbumView() {

    const { tracks, loading } = useTracks();
    const { albums } = useAlbums();

    const { id } = useLocalSearchParams();
    const headerTitle = Array.isArray(id) ? id[0] ?? "" : id ?? "";
    const principalImageUri = albums.find(u => u.title === headerTitle)?.image_uri ?? "";

    const [colorDominante, setColorDominante] = useState<string>('#000');
    const urlImagen = principalImageUri;

    useEffect(() => {
        getColors(urlImagen, {
        fallback: '#000000', // Color por si falla la carga
        cache: true,
        key: headerTitle,
        }).then((result) => {
        // En Android e iOS las propiedades cambian ligeramente
        if (result.platform === 'android') {
            setColorDominante(result.dominant || result.vibrant);
        } else if (result.platform === 'ios') {
            setColorDominante(result.background);
        }
        });
    }, []);

    return (
        <SongView
            id={headerTitle}
            tracks={tracks.filter(u => u.albumTitle === headerTitle)}
            principalColor={colorDominante}
            headerTitle={headerTitle}
            principalImageUri={principalImageUri}
        />
    );
}