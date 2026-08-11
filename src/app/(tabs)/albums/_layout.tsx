import { defaultStyles } from '@/styles/styles'
import { Stack } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const AlbumScreenLayout = () => {
	return (
		<SafeAreaProvider style={[defaultStyles.container, {backgroundColor: "#222222"}]}>
			<Stack
				screenOptions={{
        			// 'fade_from_bottom' es la animación estándar y más fluida de Android nativo
        			animation: 'slide_from_right',
					contentStyle: { backgroundColor: '#000000' },
      }}>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen name="[id]" options={{ headerShown: false, presentation: 'card'}} />
			</Stack>
			
		</SafeAreaProvider>
	)
}

export default AlbumScreenLayout