import React, { useContext } from 'react'

import Home from '../screens/Home'
import Settings from '../screens/Settings'
import NewOrder from '../screens/NewOrder'
import OrderDetails from '../screens/OrderDetails'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AppwriteContext } from '../appwrite/AppWriteContext'
import { FONT_SIZE, FONT_WEIGHT } from '../components/StyleGuide'

export type AppStackParamList = {
    Home: undefined
    Settings: undefined
    NewOrder: undefined
    OrderDetails: {
        order: {
            id: string;
            name: string;
            status: string;
            cost: number;
            color: string;
            copies: number;
            portrait: boolean;
        }
    }
}

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
    const { theme, colors } = useContext(AppwriteContext);
    const isDarkTheme = theme === 'dark';

    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerTitleAlign: 'center',
                headerBackVisible: true,
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTintColor: colors.primary,
                headerShadowVisible: false,
                headerTitleStyle: {
                    fontWeight: FONT_WEIGHT.semibold as any,
                    fontSize: FONT_SIZE.lg,
                    color: colors.text,
                },
                animation: 'slide_from_right',
                contentStyle: {
                    backgroundColor: colors.background,
                },
                headerTransparent: true,
                headerBlurEffect: isDarkTheme ? 'dark' : 'light',
            }}
        >
            <Stack.Screen
                name='Home'
                component={Home}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='Settings'
                component={Settings}
                options={{
                    title: 'Account Settings',
                    headerShown: false
                }}
            />
            <Stack.Screen
                name='NewOrder'
                component={NewOrder}
                options={{
                    title: 'Create New Order',
                }}
            />
            <Stack.Screen
                name='OrderDetails'
                component={OrderDetails}
                options={{
                    title: 'Order Details',
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    )
}

export default AppStack