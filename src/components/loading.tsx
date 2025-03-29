import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ViewStyle
} from 'react-native';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from './StyleGuide';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'large';
  color?: string;
}

const Loading = ({
  message = 'Loading...',
  fullScreen = true,
  style,
  size = 'large',
  color = '#FF3B30'
}: LoadingProps) => {
  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, style]}>
        <View style={styles.container}>
          <ActivityIndicator size={size} color={color} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 999,
  },
  container: {
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    minWidth: 120,
    minHeight: 120,
  },
  message: {
    marginTop: SPACING.md,
    color: '#1D1D1F',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium as any,
    textAlign: 'center',
  },
});

export default Loading;