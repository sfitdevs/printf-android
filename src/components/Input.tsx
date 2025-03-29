import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
    TextInputProps,
    Platform
} from 'react-native';
import { RADIUS, SPACING, FONT_SIZE, FONT_WEIGHT } from './StyleGuide';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    labelStyle?: TextStyle;
    errorStyle?: TextStyle;
    rightIcon?: React.ReactNode;
    leftIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    onLeftIconPress?: () => void;
    isPassword?: boolean;
}

const Input = ({
    label,
    error,
    placeholder,
    value,
    onChangeText,
    containerStyle,
    inputContainerStyle,
    inputStyle,
    labelStyle,
    errorStyle,
    rightIcon,
    leftIcon,
    onRightIconPress,
    onLeftIconPress,
    isPassword = false,
    secureTextEntry,
    ...rest
}: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(!isPassword);

    const handleFocus = () => {
        setIsFocused(true);
        if (rest.onFocus) {
            rest.onFocus();
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (rest.onBlur) {
            rest.onBlur();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <Text style={[styles.label, labelStyle]}>
                    {label}
                </Text>
            )}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.focusedInput,
                    error && styles.errorInput,
                    inputContainerStyle,
                ]}
            >
                {leftIcon && (
                    <TouchableOpacity
                        onPress={onLeftIconPress}
                        disabled={!onLeftIconPress}
                        style={styles.leftIcon}
                    >
                        {leftIcon}
                    </TouchableOpacity>
                )}
                <TextInput
                    style={[
                        styles.input,
                        leftIcon && styles.inputWithLeftIcon,
                        (rightIcon || isPassword) && styles.inputWithRightIcon,
                        inputStyle,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor="#A0A0A8"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    secureTextEntry={isPassword ? !showPassword : secureTextEntry}
                    {...rest}
                />
                {isPassword && (
                    <TouchableOpacity
                        style={styles.rightIcon}
                        onPress={togglePasswordVisibility}
                    >
                        <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
                    </TouchableOpacity>
                )}
                {rightIcon && !isPassword && (
                    <TouchableOpacity
                        onPress={onRightIconPress}
                        disabled={!onRightIconPress}
                        style={styles.rightIcon}
                    >
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text style={[styles.errorText, errorStyle]}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
        width: '100%',
    },
    label: {
        fontSize: FONT_SIZE.sm,
        fontWeight: FONT_WEIGHT.medium as TextStyle['fontWeight'],
        marginBottom: SPACING.xs,
        color: '#1D1D1F',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: '#D2D2D7',
        backgroundColor: '#FFFFFF',
        minHeight: 50,
        paddingHorizontal: SPACING.md,
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZE.md,
        color: '#1D1D1F',
        paddingVertical: SPACING.sm,
        fontWeight: FONT_WEIGHT.regular as TextStyle['fontWeight'],
    },
    inputWithLeftIcon: {
        paddingLeft: SPACING.xs,
    },
    inputWithRightIcon: {
        paddingRight: SPACING.xs,
    },
    focusedInput: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFFFFF',
    },
    errorInput: {
        borderColor: '#FF453A',
    },
    leftIcon: {
        marginRight: SPACING.sm,
    },
    rightIcon: {
        marginLeft: SPACING.sm,
    },
    errorText: {
        fontSize: FONT_SIZE.xs,
        color: '#FF453A',
        marginTop: SPACING.xs,
    },
    toggleText: {
        color: '#FF3B30',
        fontSize: FONT_SIZE.sm,
        fontWeight: FONT_WEIGHT.medium as TextStyle['fontWeight'],
    }
});

export default Input; 