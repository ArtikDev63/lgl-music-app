import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { colors } from './tokens'

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
	headerLargeTitle: true,
	headerLargeStyle: {
		backgroundColor: colors.background,
	},
	headerLargeTitleStyle: {
		color: colors.text,
	},
    headerStyle: {
        backgroundColor: colors.background,
    },
	headerTintColor: colors.text,
	headerTransparent: false,
	headerBlurEffect: 'prominent',
	headerShadowVisible: false,
}