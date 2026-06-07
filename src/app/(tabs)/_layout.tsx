import { Tabs } from "expo-router";

export default function TabLayout(){
    return(
        <Tabs>
            <Tabs.Screen name="songs" />
            <Tabs.Screen name="albums" />
            <Tabs.Screen name="library" />
        </Tabs>
    )
}