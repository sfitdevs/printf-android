import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, COLORS } from './StyleGuide';

interface StatusBadgeProps {
    status: string;
    size?: 'small' | 'medium' | 'large';
    showIcon?: boolean;
}

const StatusBadge = ({ status, size = 'medium', showIcon = true }: StatusBadgeProps) => {
    const statusLower = status.toLowerCase();

    // Get color based on status
    let badgeColor;
    let iconName;
    let bgColor;
    let textColor;

    switch (statusLower) {
        case 'pending':
            badgeColor = COLORS.warning;
            iconName = 'clock-time-four-outline';
            bgColor = `${COLORS.warning}15`;
            textColor = COLORS.warning;
            break;
        case 'in progress':
            badgeColor = COLORS.info;
            iconName = 'progress-clock';
            bgColor = `${COLORS.info}15`;
            textColor = COLORS.info;
            break;
        case 'completed':
            badgeColor = COLORS.success;
            iconName = 'check-circle-outline';
            bgColor = `${COLORS.success}15`;
            textColor = COLORS.success;
            break;
        case 'cancelled':
            badgeColor = COLORS.error;
            iconName = 'close-circle-outline';
            bgColor = `${COLORS.error}15`;
            textColor = COLORS.error;
            break;
        default:
            badgeColor = COLORS.zinc[500];
            iconName = 'information-outline';
            bgColor = `${COLORS.zinc[500]}15`;
            textColor = COLORS.zinc[500];
    }

    // Get size values
    let fontSize;
    let paddingVertical;
    let paddingHorizontal;
    let iconSize;
    let iconMargin;
    let height;

    switch (size) {
        case 'small':
            fontSize = FONT_SIZE.xs;
            paddingVertical = 2;
            paddingHorizontal = showIcon ? SPACING.xs : SPACING.xs / 2;
            iconSize = 12;
            iconMargin = 3;
            height = 22;
            break;
        case 'large':
            fontSize = FONT_SIZE.sm;
            paddingVertical = SPACING.xs;
            paddingHorizontal = showIcon ? SPACING.sm : SPACING.sm / 2;
            iconSize = 16;
            iconMargin = 5;
            height = 32;
            break;
        case 'medium':
        default:
            fontSize = FONT_SIZE.xs;
            paddingVertical = 4;
            paddingHorizontal = showIcon ? SPACING.sm : SPACING.xs;
            iconSize = 14;
            iconMargin = 4;
            height = 26;
    }

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: bgColor,
                    paddingVertical,
                    paddingHorizontal,
                    height,
                    borderColor: `${badgeColor}30`,
                    borderWidth: 1,
                }
            ]}
        >
            {showIcon && (
                <MaterialCommunityIcons
                    name={iconName}
                    size={iconSize}
                    color={badgeColor}
                    style={{ marginRight: iconMargin }}
                />
            )}
            <Text style={[styles.text, { color: textColor, fontSize }]}>
                {size === 'small' && statusLower === 'in progress' ? 'In Progress' : status}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        borderRadius: RADIUS.round,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontWeight: FONT_WEIGHT.semibold as any,
        textTransform: 'capitalize',
    }
});

export default StatusBadge; 