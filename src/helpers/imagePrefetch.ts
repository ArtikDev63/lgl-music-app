import { MediaItem } from "@rntp/player"
import { Image as ExpoImage } from "expo-image"

const imagePrefetchFromJson = async(data: MediaItem[]) => {

    const images = data.filter(u => u.artworkUrl && u.artworkUrl !== "" && u.artworkUrl !== null ).map(u => u.artworkUrl?.toString() ?? "")

    await ExpoImage.prefetch(images, "memory-disk").then((passed) =>
        console.log("Images prefetch: ", passed)
    )

}

export default imagePrefetchFromJson;