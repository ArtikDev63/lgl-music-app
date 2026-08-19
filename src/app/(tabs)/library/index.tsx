import { defaultStyles } from "@/styles/styles";
import { Text, View, StyleSheet } from "react-native";
import { colors, tabBarToContentMargin } from "@/constants/tokens";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LibraryScreen(){

    const insets = useSafeAreaInsets()

    return(
        <View style={[defaultStyles.container, {paddingBottom: tabBarToContentMargin.bottomPaddingMiniPlayer + insets.bottom, paddingTop: insets.top}]}>
            <View style={styles.viewScreen}>
                <Text style={[styles.text, styles.titleText]}>EN DESARROLLO</Text>
                <Text style={styles.text}>Porque yo le tengo dicho a mis fanaticos que ojos que no ven bisicleta que me llevo sabe</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewScreen: {
        height:"100%",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
    },
    titleText: {
        fontWeight: "bold",
        fontSize: 32,
        marginBottom: 20
    },
    text: {
        color: colors.text,
        paddingHorizontal: 16,
        fontSize: 25,
        textAlign: "center"
    }
})