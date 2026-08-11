// app/player.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function FullScreenPlayer() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Botón para bajar el reproductor y volver al MiniPlayer */}
            <Text onPress={() => router.back()} style={styles.closeButton}>
                🔽
            </Text>
            
            <Text style={{color: 'white', fontSize: 24, marginTop: 40}}>
                Reproductor Gigante
            </Text>
            {/* Aquí iría la carátula grande, barra de progreso, controles, etc. */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', alignItems: 'center', paddingTop: 50 },
    closeButton: { color: 'white', fontSize: 30, position: 'absolute', top: 50, left: 20 }
});