import SongsView from "@/app/components/SongsView"
import { colors } from "@/constants/tokens";
import { lglIconUri } from "@/constants/images";
import { useTracks } from "@/hooks/getLibraryData";

export default function SongView() {
    const { tracks, loading } = useTracks();

    return (
        <SongsView
            id=""
            tracks={tracks}
            principalColor={colors.primary}
            headerTitle={"JC REYES"}
            principalImageUri={lglIconUri}
        />
    );
}