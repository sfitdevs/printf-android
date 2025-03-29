import React, { useContext } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    StyleProp,
    Platform
} from 'react-native';
import { RADIUS, SPACING, COLORS, SHADOWS } from './StyleGuide';
import { AppwriteContext } from '../appwrite/AppWriteContext';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    variant?: 'elevated' | 'outlined' | 'filled' | 'flat';
    elevation?: 'sm' | 'md' | 'lg' | 'none';
}

const Card = ({
    children,
    onPress,
    style,
    variant = 'elevated',
    elevation = 'none'
}: CardProps) => {
    const { colors, theme } = useContext(AppwriteContext);

    const cardStyle = [
        styles.container,
        variant === 'elevated' && [
            styles.elevatedCard,
            {
                backgroundColor: colors.card,
                borderColor: colors.border
            }
        ],
        variant === 'outlined' && [
            styles.outlinedCard,
            {
                borderColor: colors.border
            }
        ],
        variant === 'filled' && [
            styles.filledCard,
            {
                backgroundColor: colors.card
            }
        ],
        variant === 'flat' && styles.flatCard,
        style
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.7}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    elevatedCard: {
        borderWidth: 1,
    },
    outlinedCard: {
        backgroundColor: 'transparent',
        borderWidth: 1,
    },
    filledCard: {
    },
    flatCard: {
        backgroundColor: 'transparent',
        padding: 0,
        borderWidth: 0,
    }
});

export default Card; 