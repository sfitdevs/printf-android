import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AppwriteContext, Colors } from '../appwrite/AppWriteContext';

import AuthStack from './AuthStack';
import AppStack from './AppStack';

const Router = () => {
    const { isLoggedIn, theme, colors } = useContext(AppwriteContext);

    // Create custom themes based on the app's colors
    const customLightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: colors.primary,
            background: colors.background,
            card: colors.card,
            text: colors.text,
            border: colors.border,
        },
    };

    const customDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            primary: colors.primary,
            background: colors.background,
            card: colors.card,
            text: colors.text,
            border: colors.border,
        },
    };

    // Determine which theme to use
    const isDarkMode = colors.background === Colors.dark.background;
    const navigationTheme = isDarkMode ? customDarkTheme : customLightTheme;

    return (
        <NavigationContainer theme={navigationTheme}>
            {isLoggedIn ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default Router; 