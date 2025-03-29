import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from './StyleGuide';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
    title: string;
    onBack?: () => void;
    rightComponent?: React.ReactNode;
    textColor?: string;
    backgroundColor?: string;
    elevated?: boolean;
}

const Header = ({
    title,
    onBack,
    rightComponent,
    textColor = '#000000',
    backgroundColor = '#FFFFFF',
    elevated = false
}: HeaderProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor,
                    paddingTop: insets.top + SPACING.sm,
                }
            ]}
        >
            <View style={styles.content}>
                {onBack && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBack}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color={textColor} />
                    </TouchableOpacity>
                )}

                <Text
                    style={[
                        styles.title,
                        { color: textColor, marginLeft: onBack ? SPACING.xs : 0 }
                    ]}
                    numberOfLines={1}
                >
                    {title}
                </Text>

                {rightComponent && (
                    <View style={styles.rightComponent}>
                        {rightComponent}
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: SPACING.md,
        paddingHorizontal: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
    },
    backButton: {
        padding: SPACING.xs,
        marginRight: SPACING.xs,
        marginLeft: -SPACING.xs,
    },
    title: {
        flex: 1,
        fontSize: FONT_SIZE.lg,
        fontWeight: FONT_WEIGHT.semibold as any,
    },
    rightComponent: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default Header; 