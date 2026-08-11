import SongsView from "@/app/components/SongsView"
import dataSongs from "@/assets/data/songs_json.json"
import { colors } from "@/constants/tokens";
import { lglIconUri } from "@/constants/images";

export default function SongView() {
    const mediaSongsData = dataSongs.map((song) => ({
        ...song,
        url: song.song_uri,
    }));

    return (
        <SongsView
            contextId="all"
            dataJSON={mediaSongsData}
            principalColor={colors.primary}
            headerTitle={"JC REYES"}
            principalImageUri={lglIconUri}
        />
    );
}