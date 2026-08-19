import { MenuView } from '@react-native-menu/menu'
import { useRouter } from 'expo-router'
import { PropsWithChildren } from 'react'
import TrackPlayer, { MediaItem } from '@rntp/player'
import Entypo from '@expo/vector-icons/Entypo';
import { Platform, ViewStyle } from 'react-native';

type TrackShortcutsMenuProps = PropsWithChildren<{onAddToQueue?: (track: MediaItem) => void; style?: ViewStyle, track: MediaItem }>

const TrackShortcutsMenu = ({onAddToQueue: handleAddQueue, children, style, track }: TrackShortcutsMenuProps) => {

	const handlePressAction = (id: string) => {
		if(id === "add-to-queue"){
            handleAddQueue?.(track)
        }
	}

	return (
		<MenuView
            style={style}
			onPressAction={({ nativeEvent: { event } }) => handlePressAction(event)}
			actions={[
				{
					id: "add-to-queue",
					title: "Añadir a la cola",
					image:  Platform.select({
                                ios: 'text.badge.plus',
                                android: 'ic_menu_add',
				            }),
                }
			]}
		>
			{children}
		</MenuView>
	)
}

export default TrackShortcutsMenu;