import React, { useContext, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Image,
    Animated,
    Easing,
} from 'react-native';
import { AppwriteContext } from '../appwrite/AppWriteContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../routes/AppStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, COLORS, CommonStyles } from '../components/StyleGuide';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import Header from '../components/Header';
import Button from '../components/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type OrderDetailsScreenProps = NativeStackScreenProps<AppStackParamList, 'OrderDetails'>;

// Type definitions for expandable sections
interface ExpandableSectionProps {
    title: string;
    children: React.ReactNode;
    isInitiallyExpanded?: boolean;
    textColor: string;
    backgroundColor: string;
    icon?: string;
}

// Component for expandable sections
const ExpandableSection = ({
    title,
    children,
    isInitiallyExpanded = true,
    textColor,
    backgroundColor,
    icon
}: ExpandableSectionProps) => {
    const [expanded, setExpanded] = useState(isInitiallyExpanded);
    const [rotateAnim] = useState(new Animated.Value(isInitiallyExpanded ? 1 : 0));

    const toggleExpand = () => {
        Animated.timing(rotateAnim, {
            toValue: expanded ? 0 : 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
        setExpanded(!expanded);
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <Card variant="elevated" elevation="sm" style={[styles.expandableSection, { backgroundColor }]}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.expandableHeader}
                onPress={toggleExpand}
            >
                <View style={styles.expandableTitleContainer}>
                    {icon && (
                        <MaterialCommunityIcons
                            name={icon}
                            size={22}
                            color={textColor}
                            style={styles.sectionIcon}
                        />
                    )}
                    <Text style={[styles.expandableTitle, { color: textColor }]}>{title}</Text>
                </View>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <MaterialCommunityIcons name="chevron-down" size={24} color={textColor} />
                </Animated.View>
            </TouchableOpacity>
            {expanded && <View style={styles.expandableContent}>{children}</View>}
        </Card>
    );
};

// Type definitions for timeline item
interface TimelineItemProps {
    title: string;
    time: string | null;
    isActive: boolean;
    isLast: boolean;
    isDone: boolean;
    color: string;
    textColor: string;
    subtextColor: string;
}

// Component for timeline item - redesigned for a more modern look
const TimelineItem = ({
    title,
    time,
    isActive,
    isLast,
    isDone,
    color,
    textColor,
    subtextColor
}: TimelineItemProps) => {
    return (
        <View style={styles.timelineItemContainer}>
            <View style={styles.timelineItemLeft}>
                <View style={[
                    styles.timelineDot,
                    {
                        backgroundColor: isDone
                            ? COLORS.primary.default
                            : (isActive ? 'transparent' : 'transparent'),
                        borderColor: isDone
                            ? COLORS.primary.default
                            : (isActive ? COLORS.primary.default : color),
                        borderWidth: 1
                    }
                ]}>
                    {isDone && (
                        <MaterialCommunityIcons
                            name="check"
                            size={10}
                            color="#FFFFFF"
                        />
                    )}
                </View>
                {!isLast && (
                    <View
                        style={[
                            styles.timelineLine,
                            {
                                backgroundColor: isDone ? COLORS.primary.default : color,
                                opacity: isDone ? 1 : 0.2
                            }
                        ]}
                    />
                )}
            </View>
            <View style={styles.timelineItemRight}>
                <Text style={[
                    styles.timelineTitle,
                    {
                        color: isActive || isDone ? textColor : subtextColor,
                        fontWeight: (isActive || isDone) ? FONT_WEIGHT.semibold : FONT_WEIGHT.regular
                    }
                ]}>
                    {title}
                </Text>
                {(isActive || isDone) && time && (
                    <Text style={[styles.timelineTime, { color: subtextColor }]}>{time}</Text>
                )}
            </View>
        </View>
    );
};

const OrderDetails = ({ route, navigation }: OrderDetailsScreenProps) => {
    const { order } = route.params;
    const { theme, colors } = useContext(AppwriteContext);
    const insets = useSafeAreaInsets();
    const isDarkTheme = theme === 'dark';

    // Calculate bottom padding to avoid overlapping with navigation bar
    const bottomPadding = Math.max(insets.bottom, 20);

    const handleBack = () => {
        navigation.goBack();
    };

    // Determine if the order is in each state
    const isPending = order.status.toLowerCase() === 'pending';
    const isInProgress = order.status.toLowerCase() === 'in progress';
    const isCompleted = order.status.toLowerCase() === 'completed';

    // Get status color based on order status - always return primary red color
    const getStatusColor = () => {
        return COLORS.primary.default;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar
                barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
                backgroundColor="transparent"
                translucent
            />

            {/* Header with back button */}
            <Header
                title="Order Details"
                onBack={handleBack}
                textColor={colors.text}
                backgroundColor={colors.background}
                elevated
            />

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContainer,
                    { paddingBottom: bottomPadding + SPACING.lg }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Order Status Card */}
                <Card
                    variant="elevated"
                    elevation="md"
                    style={[styles.statusCardContainer, { backgroundColor: colors.card }]}
                >
                    <View style={styles.statusCardHeader}>
                        <View>
                            <Text style={[styles.statusCardOrderId, { color: colors.subtext }]}>
                                Order #{order.id}
                            </Text>
                            <Text style={[styles.statusCardName, { color: colors.text }]}>
                                {order.name}
                            </Text>
                        </View>
                        <StatusBadge status={order.status} size="large" />
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Order summary grid */}
                    <View style={styles.orderSummaryGrid}>
                        <View style={styles.orderSummaryItem}>
                            <MaterialCommunityIcons
                                name="palette"
                                size={20}
                                color={getStatusColor()}
                                style={styles.summaryIcon}
                            />
                            <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
                                Color
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>
                                {order.color}
                            </Text>
                        </View>

                        <View style={styles.orderSummaryItem}>
                            <MaterialCommunityIcons
                                name="content-copy"
                                size={20}
                                color={getStatusColor()}
                                style={styles.summaryIcon}
                            />
                            <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
                                Copies
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>
                                {order.copies}
                            </Text>
                        </View>

                        <View style={styles.orderSummaryItem}>
                            <MaterialCommunityIcons
                                name="rotate-3d"
                                size={20}
                                color={getStatusColor()}
                                style={styles.summaryIcon}
                            />
                            <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
                                Orientation
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>
                                {order.portrait ? 'Portrait' : 'Landscape'}
                            </Text>
                        </View>

                        <View style={styles.orderSummaryItem}>
                            <MaterialCommunityIcons
                                name="cash"
                                size={20}
                                color={getStatusColor()}
                                style={styles.summaryIcon}
                            />
                            <Text style={[styles.summaryLabel, { color: colors.subtext }]}>
                                Total Cost
                            </Text>
                            <Text style={[styles.summaryValue, { color: colors.text }]}>
                                ${order.cost.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* Order Timeline Section - Redesigned for a more modern look */}
                <Card
                    variant="elevated"
                    elevation="sm"
                    style={[styles.timelineCard, { backgroundColor: colors.card }]}
                >
                    <View style={[styles.timelineHeader, { borderBottomColor: `${colors.border}30` }]}>
                        <View style={styles.timelineTitleContainer}>
                            <View style={[styles.timelineIconContainer, { backgroundColor: `${COLORS.primary.default}10` }]}>
                                <MaterialCommunityIcons
                                    name="timeline-clock"
                                    size={18}
                                    color={COLORS.primary.default}
                                />
                            </View>
                            <Text style={[styles.timelineCardTitle, { color: colors.text }]}>Order Progress</Text>
                        </View>
                        <Text style={[styles.statusText, { color: colors.subtext }]}>
                            {isPending ? 'Pending' : isInProgress ? 'In Progress' : 'Completed'}
                        </Text>
                    </View>

                    <View style={styles.timelineContainer}>
                        <TimelineItem
                            title="Order Placed"
                            time="May 15, 2023 - 10:30 AM"
                            isActive={true}
                            isLast={false}
                            isDone={true}
                            color={colors.border}
                            textColor={colors.text}
                            subtextColor={colors.subtext}
                        />
                        <TimelineItem
                            title="Processing"
                            time={isInProgress || isCompleted ? "May 15, 2023 - 11:45 AM" : null}
                            isActive={isInProgress || isCompleted}
                            isLast={false}
                            isDone={isCompleted}
                            color={colors.border}
                            textColor={colors.text}
                            subtextColor={colors.subtext}
                        />
                        <TimelineItem
                            title="Ready for Pickup"
                            time={isCompleted ? "May 16, 2023 - 09:15 AM" : null}
                            isActive={isCompleted}
                            isLast={false}
                            isDone={isCompleted}
                            color={colors.border}
                            textColor={colors.text}
                            subtextColor={colors.subtext}
                        />
                        <TimelineItem
                            title="Completed"
                            time={isCompleted ? "May 16, 2023 - 02:30 PM" : null}
                            isActive={isCompleted}
                            isLast={true}
                            isDone={isCompleted}
                            color={colors.border}
                            textColor={colors.text}
                            subtextColor={colors.subtext}
                        />
                    </View>
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionSection}>
                    {!isCompleted && (
                        <Button
                            title="Cancel Order"
                            icon={<MaterialCommunityIcons name="close-circle" size={18} color={COLORS.error} />}
                            variant="outline"
                            onPress={() => {/* Handle cancel order */ }}
                            style={styles.cancelButton}
                            textStyle={{ color: COLORS.error }}
                        />
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        padding: SPACING.lg,
    },
    // Status Card Styles
    statusCardContainer: {
        marginBottom: SPACING.lg,
        padding: 0,
        overflow: 'hidden',
        borderRadius: RADIUS.lg,
    },
    statusCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: SPACING.md,
    },
    statusCardOrderId: {
        fontSize: FONT_SIZE.xs,
        fontWeight: FONT_WEIGHT.medium as any,
        marginBottom: SPACING.xs / 2,
    },
    statusCardName: {
        fontSize: FONT_SIZE.lg,
        fontWeight: FONT_WEIGHT.bold as any,
    },
    divider: {
        height: 1,
        width: '100%',
    },
    // Order Summary Grid
    orderSummaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: SPACING.md,
    },
    orderSummaryItem: {
        width: '50%',
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.xs,
    },
    summaryIcon: {
        marginBottom: SPACING.xs / 2,
    },
    summaryLabel: {
        fontSize: FONT_SIZE.xs,
        fontWeight: FONT_WEIGHT.regular as any,
    },
    summaryValue: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.semibold as any,
        marginTop: 2,
    },
    trackButton: {
        margin: SPACING.md,
        marginTop: 0,
    },
    // Expandable Section Styles
    expandableSection: {
        marginBottom: SPACING.md,
        overflow: 'hidden',
        padding: 0,
    },
    expandableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
    },
    expandableTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionIcon: {
        marginRight: SPACING.xs,
    },
    expandableTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.semibold as any,
    },
    expandableContent: {
        padding: SPACING.md,
        paddingTop: 0,
    },
    // Timeline Styles
    timelineCard: {
        marginBottom: SPACING.md,
        overflow: 'hidden',
        padding: 0,
        borderRadius: RADIUS.lg,
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
    },
    timelineTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timelineIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.xs,
    },
    timelineCardTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.semibold as any,
    },
    statusText: {
        fontSize: FONT_SIZE.sm,
    },
    timelineContainer: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.md,
    },
    timelineItemContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
    },
    timelineItemLeft: {
        alignItems: 'center',
        paddingRight: SPACING.sm,
        width: 24,
    },
    timelineItemRight: {
        flex: 1,
        paddingBottom: SPACING.md,
    },
    timelineDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginTop: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineTitle: {
        fontSize: FONT_SIZE.sm,
        marginBottom: 2,
    },
    timelineTime: {
        fontSize: FONT_SIZE.xs,
        opacity: 0.7,
    },
    timelineLine: {
        width: 1,
        height: 35,
        marginVertical: 3,
    },
    // Action Section Styles
    actionSection: {
        marginTop: SPACING.md,
    },
    cancelButton: {
        marginBottom: SPACING.sm,
        borderColor: COLORS.error,
    },
});

export default OrderDetails; 