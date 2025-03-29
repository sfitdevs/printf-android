import React, { FC, createContext, useState, useEffect } from 'react';
import AppwriteService from './service';
import { PropsWithChildren } from 'react';
import { useColorScheme, View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@printf_theme_preference';

export type ThemeType = 'dark' | 'light' | 'system';

export const Colors = {
  dark: {
    primary: '#FF3B30',
    primaryLight: '#FF8A80',
    primaryDark: '#C62828',
    background: '#000000',
    card: '#171717',
    text: '#FFFFFF',
    subtext: '#9CA3AF',
    border: '#333333',
    error: '#FF3B30',
    success: '#00C853',
    warning: '#FFC107',
    info: '#2196F3',
    accent: '#FF3B30'
  },
  light: {
    primary: '#FF3B30',
    primaryLight: '#FF8A80',
    primaryDark: '#C62828',
    background: '#FFFFFF',
    card: '#F9FAFB',
    text: '#000000',
    subtext: '#6B7280',
    border: '#E5E7EB',
    error: '#FF3B30',
    success: '#00C853',
    warning: '#FFC107',
    info: '#2196F3',
    accent: '#FF3B30'
  }
};

type AppContextType = {
  appwrite: AppwriteService;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: typeof Colors.dark | typeof Colors.light;
}

export const AppwriteContext = createContext<AppContextType>({
  appwrite: new AppwriteService(),
  isLoggedIn: false,
  setIsLoggedIn: () => { },
  theme: 'system',
  setTheme: () => { },
  colors: Colors.light
});

const LoadingSplash = () => {
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  const indicatorColor = '#FF3B30'; // Primary color

  return (
    <View style={[styles.splashContainer, { backgroundColor }]}>
      <ActivityIndicator size="large" color={indicatorColor} />
    </View>
  );
};

export const AppwriteProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('system');
  const [isLoading, setIsLoading] = useState(true);
  const systemColorScheme = useColorScheme();

  // Load saved theme preference when app starts
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setTheme(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      } finally {
        // Add a small delay to prevent flickering
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference whenever it changes
  const handleSetTheme = async (newTheme: ThemeType) => {
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  const colors = theme === 'system'
    ? (systemColorScheme === 'dark' ? Colors.dark : Colors.light)
    : (theme === 'dark' ? Colors.dark : Colors.light);

  const defaultValue = {
    appwrite: new AppwriteService(),
    isLoggedIn,
    setIsLoggedIn,
    theme,
    setTheme: handleSetTheme,
    colors
  };

  if (isLoading) {
    return <LoadingSplash />;
  }

  return (
    <AppwriteContext.Provider value={defaultValue}>
      {children}
    </AppwriteContext.Provider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});