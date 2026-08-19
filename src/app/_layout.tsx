import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { useSetupTrackPlayer } from '@/hooks/useSetupTrackPlayer';
import { useLogTrackPlayerState } from '@/hooks/useLogTrackPlayerState';
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useTrackPlayerEvents } from '@/hooks/useTrackPlayerEvents';
import imagePrefetchFromJson from '@/helpers/imagePrefetch';
import dataSongs from "@/assets/data/songs_json.json"
import { preloadLibraryData } from '@/hooks/getLibraryData';
import { ActivityIndicator } from 'react-native';
import { colors } from '@/constants/tokens';

export const unstable_settings = {
  	initialRouteName: '(tabs)', 
};

SplashScreen.preventAutoHideAsync();

const App = () => {
	const [isAppReady, setIsAppReady] = useState(false);

	const handleTrackPlayerLoaded = useCallback(async() => {
		
		try{	
			const {tracks} = await preloadLibraryData()
			await imagePrefetchFromJson(tracks)

		} catch (error) {
            console.error('Error al inicializar:', error);
        } finally {
            // 2. Marcamos como listo y quitamos el splash
            setIsAppReady(true);
            await SplashScreen.hideAsync();
        }


		
	}, [])

	useSetupTrackPlayer({
		onLoad: handleTrackPlayerLoaded,
	})

	useLogTrackPlayerState()
	useTrackPlayerEvents()

	if (!isAppReady) {
        return (
			<SafeAreaProvider>
				<SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
				<ActivityIndicator size="large" color={colors.primary}/>
				</SafeAreaView>
			</SafeAreaProvider>
		);
    }

	return (
	<SafeAreaProvider>
		<GestureHandlerRootView style={{ flex: 1 }}>
			<RootNavigation/>
			<StatusBar style='light'/>
		</GestureHandlerRootView>
	</SafeAreaProvider>
	)
}

const RootNavigation = () => {
	return (
		<Stack>
			<Stack.Screen name='(tabs)' options={{headerShown: false}}/>
			<Stack.Screen 
                name="player" 
                options={{ 
                    headerShown: false,
                    presentation: 'transparentModal', // Hace que suba desde abajo
					gestureEnabled: true,
					gestureDirection: "vertical",
					animationDuration: 400,
					animation: "slide_from_bottom",
					fullScreenGestureEnabled: true,
                }} 
            />
		</Stack>
	)
}

export default App;
