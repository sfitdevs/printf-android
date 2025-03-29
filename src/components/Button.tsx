import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
    Platform
} from 'react-native';
import { RADIUS, SPACING, FONT_SIZE, FONT_WEIGHT, COLORS } from './StyleGuide';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    style?: ViewStyle;
    textStyle?: TextStyle;
    width?: number | string;
}

const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    style,
    textStyle,
    width
}: ButtonProps) => {

    // Get height based on size
    const getHeight = () => {
        switch (size) {
            case 'small':
                return 40;
            case 'large':
                return 56;
            case 'medium':
            default:
                return 48;
        }
    };

    // Get padding based on size
    const getPadding = () => {
        switch (size) {
            case 'small':
                return SPACING.sm;
            case 'large':
                return SPACING.lg;
            case 'medium':
            default:
                return SPACING.md;
        }
    };

    // Get font size based on size
    const getFontSize = () => {
        switch (size) {
            case 'small':
                return FONT_SIZE.sm;
            case 'large':
                return FONT_SIZE.lg;
            case 'medium':
            default:
                return FONT_SIZE.md;
        }
    };

    // Get the style based on variant
    const getButtonStyle = () => {
        const baseStyle: ViewStyle = {
            height: getHeight(),
            paddingHorizontal: getPadding(),
            borderRadius: RADIUS.md,
            ...styles.button,
        };

        if (width) {
            baseStyle.width = width;
        }

        switch (variant) {
            case 'secondary':
                return [baseStyle, styles.secondaryButton, disabled && styles.disabledButton, style];
            case 'outline':
                return [baseStyle, styles.outlineButton, disabled && styles.disabledOutlineButton, style];
            case 'text':
                return [baseStyle, styles.textButton, disabled && styles.disabledTextButton, style];
            case 'primary':
            default:
                return [baseStyle, styles.primaryButton, disabled && styles.disabledButton, style];
        }
    };

    // Get the text style based on variant
    const getTextStyle = () => {
        const baseStyle: TextStyle = {
            fontSize: getFontSize(),
            fontWeight: FONT_WEIGHT.medium as TextStyle['fontWeight'],
            ...styles.buttonText,
        };

        switch (variant) {
            case 'outline':
                return [baseStyle, styles.outlineButtonText, disabled && styles.disabledOutlineButtonText, textStyle];
            case 'text':
                return [baseStyle, styles.textButtonText, disabled && styles.disabledTextButtonText, textStyle];
            case 'secondary':
            case 'primary':
            default:
                return [baseStyle, styles.primaryButtonText, disabled && styles.disabledButtonText, textStyle];
        }
    };

    return (
        <TouchableOpacity
            style={getButtonStyle()}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'text' ? COLORS.primary.default : '#FFFFFF'} />
            ) : (
                <View style={styles.contentContainer}>
                    {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
                    <Text style={getTextStyle()}>{title}</Text>
                    {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    primaryButton: {
        backgroundColor: COLORS.primary.default,
    },
    secondaryButton: {
        backgroundColor: COLORS.zinc[700],
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: COLORS.primary.default,
    },
    textButton: {
        backgroundColor: 'transparent',
    },
    disabledButton: {
        backgroundColor: COLORS.zinc[300],
    },
    disabledOutlineButton: {
        borderColor: COLORS.zinc[300],
    },
    disabledTextButton: {
        opacity: 0.5,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: FONT_WEIGHT.semibold as TextStyle['fontWeight'],
    },
    primaryButtonText: {
        color: '#FFFFFF',
    },
    outlineButtonText: {
        color: COLORS.primary.default,
    },
    textButtonText: {
        color: COLORS.primary.default,
    },
    disabledButtonText: {
        color: COLORS.zinc[500],
    },
    disabledOutlineButtonText: {
        color: COLORS.zinc[400],
    },
    disabledTextButtonText: {
        color: COLORS.zinc[400],
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLeft: {
        marginRight: SPACING.sm,
    },
    iconRight: {
        marginLeft: SPACING.sm,
    },
});

export default Button; 