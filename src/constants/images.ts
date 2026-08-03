import unknownSongImage from "@/assets/unknown-album.png";
import lglIcon from "@/assets/lgl-icon.png";

import { Image } from 'react-native'

export const unknownTrackImageUri = Image.resolveAssetSource(unknownSongImage).uri

export const lglIconUri = Image.resolveAssetSource(lglIcon).uri