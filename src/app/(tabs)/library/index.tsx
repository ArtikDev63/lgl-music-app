import { defaultStyles } from "@/styles/styles";
import { ScrollView, Text, View, Animated, StyleSheet } from "react-native";
import TrackList from "@/app/components/TrackList";
import { tabBarToContentMargin } from "@/constants/tokens";

export default function SongScreen(){

    return(
        <View style={defaultStyles.container}>
            <ScrollView >
                <Text style={{color: "white"}}>Hey</Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        justifyContent: "center",
        alignItems: "center",
        left: 0,
        right: 0,
    }
})