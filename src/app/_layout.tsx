import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import TrackPlayer, { PlayerCommand } from '@rntp/player';
import useMusicPlayer from '@/music_service/playService';
import {Image as ExpoImage} from "expo-image"
import dataSongs from "@/assets/data/songs_json.json"
import { AppState } from 'react-native';

export const unstable_settings = {
  	initialRouteName: '(tabs)', 
};

SplashScreen.preventAutoHideAsync();

export default function App(){

	useEffect(() => {
    // Cuando el layout base se ha montado de forma nativa, ocultamos la Splash Screen
    // Esto garantiza que nunca se vea el lienzo en blanco intermedio
    	SplashScreen.hideAsync();
  	}, []);

	const syncPlayerState = useMusicPlayer((state) => state.syncPlayerState);
	const appState = useRef(AppState.currentState);

	useEffect(() => {
        // Esto sincroniza cuando abres la app por primera vez (ya lo tenías)
        syncPlayerState();

        // 3. Creamos un espía que escucha cuando la app se minimiza o maximiza
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            // Si la app estaba inactiva/en fondo y ahora pasa a 'active' (primer plano)
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log("📱 La app volvió a pantalla. Sincronizando estado...");
                // ¡Fuerza a leer la canción y el estado real del motor nativo!
                syncPlayerState();
            }

            // Actualizamos el ref con el nuevo estado
            appState.current = nextAppState;
        });

        // 4. Limpieza estándar de React
        return () => {
            subscription.remove();
        };
    }, []); // Array vacío para que solo se suscriba una vez

	useEffect(() => {
    async function setupAudio() {
      try {
        // 1. Intentamos inicializar el reproductor
        await TrackPlayer.setupPlayer({
		contentType: 'music',
		cache: {
			preloading: {
				window: 2,
			}
		},
		android: {
			taskRemovedBehavior: "stop",
			notification: {
				channelId: "Hey",
				channelName: "JC REYES",
				smallIcon: "../assets/lgl_logo.png"
			}
		}
	});

        // 2. Configuramos los controles si el paso anterior tuvo éxito
        await TrackPlayer.setCommands({
		capabilities: [
			PlayerCommand.PlayPause,
			PlayerCommand.Next,
			PlayerCommand.Previous,
			PlayerCommand.Seek,
		],
		backwardInterval: 15,
		forwardInterval: 30,
	})

        console.log("▶️ Motor de audio inicializado");

      } catch (error) {
        // 3. LA MAGIA: Si haces un Hot Reload o cambias de pestaña, 
        // el error se captura aquí en silencio y la app no crashea.
        console.log("⚠️ El reproductor ya estaba listo");
      }
    }

    setupAudio();
  }, []); // <-- El array vacío asegura que esto solo se intente UNA vez al abrir la app

	

	

	useEffect(() => {
		if (dataSongs && dataSongs.length > 0) {
			// 1. Extrae solo las URLs de las imágenes de tus 280 elementos
			const urlsParaDescargar = dataSongs
      			.filter(item => item && typeof item.image_uri === 'string' && item.image_uri.startsWith('http'))
      			.map(item => item.image_uri);
			
			// 2. Fuerza la descarga en segundo plano al almacenamiento local del teléfono
			ExpoImage.prefetch(urlsParaDescargar)
			.then((resultado) => {
				console.log('Prefetch done:', resultado);
			})
			.catch((error) => {
				console.error('Error en el prefetch:', error);
			});
		}
		}, [dataSongs]);

	return (
	<SafeAreaProvider>
		<Stack initialRouteName="(tabs)" screenOptions={{headerShown: false}}>
			<Stack.Screen name='(tabs)' options={{headerShown: false}}/>
			<Stack.Screen 
                name="player" 
                options={{ 
                    headerShown: false,
                    presentation: 'fullScreenModal', // Hace que suba desde abajo
                    animation: 'slide_from_bottom'   // Fuerza la animación de Spotify
                }} 
            />
		</Stack>
		<StatusBar style='light'/>
	</SafeAreaProvider>
	)
}
