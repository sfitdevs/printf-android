import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Updated color palette with more prominent colors
export const COLORS = {
    primary: {
        default: '#FF3B30', // Brighter red
        light: '#FF8A80',   // Lighter red
        dark: '#C62828',    // Darker red
    },
    zinc: {
        50: '#FFFFFF',
        100: '#F9FAFB',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
        950: '#000000',
    },
    success: '#00C853', // Brighter green
    warning: '#FFC107', // Brighter amber
    error: '#FF3B30',   // Matches primary red
    info: '#2196F3',    // Brighter blue
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
};

export const FONT_SIZE = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
};

export const FONT_WEIGHT = {
    thin: '100',
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900'
};

export const RADIUS = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    round: 1000
};

// Empty SHADOWS object for completely removing shadows
export const SHADOWS = {
    none: {},
    xs: {},
    sm: {},
    md: {},
    lg: {},
    primary: {},
};

// Common styles that can be used across the app
export const CommonStyles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowStart: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    card: {
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        backgroundColor: COLORS.zinc[50],
        borderWidth: 1,
        borderColor: COLORS.zinc[200],
    },
    input: {
        height: 50,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.md,
        backgroundColor: COLORS.zinc[50],
        borderWidth: 1,
        borderColor: COLORS.zinc[200],
    },
    button: {
        height: 50,
        borderRadius: RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.primary.default,
    },
    screenContainer: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        backgroundColor: COLORS.zinc[100],
    }
});

export default {
    COLORS,
    SPACING,
    FONT_SIZE,
    FONT_WEIGHT,
    RADIUS,
    SHADOWS,
    CommonStyles,
}; 