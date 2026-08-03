import { defaultStyles } from '@/styles/styles'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const LibraryScreenLayout = () => {
	return (
		<SafeAreaView style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
		</SafeAreaView>
	)
}

export default LibraryScreenLayout