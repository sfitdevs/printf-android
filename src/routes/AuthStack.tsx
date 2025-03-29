import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login'
import Signup from '../screens/Signup'
import { AppwriteContext } from '../appwrite/AppWriteContext'

export type AuthStackParamList = {
    Login: undefined
    Signup: undefined
}

const Stack = createNativeStackNavigator<AuthStackParamList>()

const AuthStack = () => {
    const { colors, theme } = useContext(AppwriteContext);
    const isDarkTheme = theme === 'dark' || (theme === 'system' && colors.background === '#18181B');

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                headerTintColor: colors.primary,
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerTitleStyle: {
                    color: colors.text,
                }
            }}
        >
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='Signup' component={Signup} />
        </Stack.Navigator>
    )
}

export default AuthStack; 