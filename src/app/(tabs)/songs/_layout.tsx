import { defaultStyles } from '@/styles/styles'
import { Stack } from 'expo-router'
import { View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

const SongsScreenLayout = () => {
	return (
		<SafeAreaProvider style={defaultStyles.container}>
			<Stack>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,

					}}
				/>
			</Stack>
		</SafeAreaProvider>
	)
}

export default SongsScreenLayout