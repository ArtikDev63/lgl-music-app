import SongView from "@/app/components/SongsView"
import dataSongs from "@/assets/data/songs_json.json"
import dataAlbums from "@/assets/data/albums_json.json"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react";
import { getColors } from "react-native-image-colors";

export default function AlbumView() {
    const { id } = useLocalSearchParams();
    const headerTitle = Array.isArray(id) ? id[0] ?? "" : id ?? "";
    const principalImageUri = dataAlbums.find(u => u.title === headerTitle)?.image_uri ?? "";

    const [colorDominante, setColorDominante] = useState<string>('#000');
    const urlImagen = principalImageUri;

    useEffect(() => {
        getColors(urlImagen, {
        fallback: '#000000', // Color por si falla la carga
        cache: true,
        key: urlImagen,
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
            contextId={headerTitle}
            dataJSON={dataSongs.filter(u => u.album === headerTitle)}
            principalColor={colorDominante}
            headerTitle={headerTitle}
            principalImageUri={principalImageUri}
        />
    );
}