import { colors, fontSize } from "@/constants/tokens";
import { Tabs } from "expo-router";
import { BlurView, BlurTargetView } from "expo-blur";
import { useRef } from 'react';
import { Platform, StyleSheet, View } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabNavigation(){

    const targetRef = useRef(null);
    const insets = useSafeAreaInsets()

    return(
        <BlurTargetView ref={targetRef} style={{flex: 1}}>
            <Tabs screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,
                tabBarLabelStyle: {
                    fontSize: fontSize.xs,
                    fontWeight: "500",
                },
                tabBarStyle: {
                    ...Platform.select({
                        android: {
                        // Si el sistema detecta que el inset inferior es 0 (frecuente en Android con gestos), 
                        // aplicamos un respaldo de 16px para evitar que toque el borde inferior.
                        height: 60 + (insets.bottom === 0 ? 16 : insets.bottom),
                        paddingBottom: insets.bottom === 0 ? 12 : insets.bottom,
                    }}),
                    position: "absolute",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    borderTopWidth: 0,
                    padding: 8,
                    backgroundColor: "transparent",
                    elevation: 0,
                },
                headerShown: false,
                tabBarBackground: () => <BlurView
                    intensity={100}
                    tint="dark"
                    blurMethod="dimezisBlurView"
                    blurTarget={targetRef}
                    style={{
                    ...StyleSheet.absoluteFill,
                    overflow: "hidden",
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                }}/>,
                
            }}>
                <Tabs.Screen name="songs" options={{
                    title: "Canciones",
                    tabBarIcon: ({color}) => <FontAwesome5 name="itunes-note" size={24} color={color} />
                }}/>
                <Tabs.Screen name="albums" options={{
                    title: "Albums",
                    tabBarIcon: ({color}) => <FontAwesome5 name="compact-disc" size={24} color={color} />
                }}/>
                <Tabs.Screen name="library" options={{
                    title: "Biblioteca",
                    tabBarIcon: ({color}) => <Ionicons name="library" size={24} color={color} />
                }}/>
            </Tabs>
        </BlurTargetView>

    )
}