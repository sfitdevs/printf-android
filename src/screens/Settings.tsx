import React, { useContext, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Switch,
    ActivityIndicator,
    Platform,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppwriteContext } from '../appwrite/AppWriteContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../routes/AppStack';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, COLORS } from '../components/StyleGuide';
import Card from '../components/Card';
import Header from '../components/Header';
import Button from '../components/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type SettingsScreenProps = NativeStackScreenProps<AppStackParamList, 'Settings'>;

const Settings = ({ navigation }: SettingsScreenProps) => {
    const { appwrite, setIsLoggedIn, theme, colors, setTheme } = useContext(AppwriteContext);
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<{
        name: string;
        email: string;
        id: string;
    } | null>(null);

    const APP_VERSION = '1.0.0';
    const isDarkTheme = theme === 'dark';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await appwrite.getCurrentUser();
                if (user) {
                    setUserData({
                        name: user.name,
                        email: user.email,
                        id: user.$id,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [appwrite]);

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await appwrite.logout();
                            setIsLoggedIn(false);
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleBack = () => {
        navigation.goBack();
    };

    // Calculate bottom padding to avoid overlapping with navigation bar
    const bottomPadding = Math.max(insets.bottom, 20);

    // Render profile section
    const renderProfileSection = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary.default} />
                </View>
            );
        }

        if (!userData) {
            return (
                <View style={styles.emptyProfileContainer}>
                    <MaterialCommunityIcons
                        name="account-off-outline"
                        size={48}
                        color={colors.subtext}
                        style={styles.emptyProfileIcon}
                    />
                    <Text style={[styles.emptyProfileText, { color: colors.subtext }]}>
                        No user data available
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.profileSection}>
                <View style={[styles.avatarContainer, { backgroundColor: COLORS.primary.default }]}>
                    <Text style={styles.avatarText}>{userData.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.profileDetails}>
                    <Text style={[styles.profileName, { color: colors.text }]}>{userData.name}</Text>
                    <Text style={[styles.profileEmail, { color: colors.subtext }]}>{userData.email}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar
                barStyle={isDarkTheme ? "light-content" : "dark-content"}
                backgroundColor="transparent"
                translucent
            />

            {/* Header with back button */}
            <Header
                title="Settings"
                onBack={handleBack}
                textColor={colors.text}
                backgroundColor={colors.background}
                elevated
            />

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: bottomPadding + SPACING.lg }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Container */}
                <View style={[styles.profileContainer, { backgroundColor: colors.card }]}>
                    {renderProfileSection()}
                </View>

                {/* Settings Sections */}
                <Text style={[styles.sectionHeader, { color: colors.subtext }]}>APPEARANCE</Text>
                <View style={[styles.settingsGroup, { backgroundColor: colors.card }]}>
                    {/* Theme Setting */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary.default}15` }]}>
                                <MaterialCommunityIcons
                                    name="theme-light-dark"
                                    size={20}
                                    color={COLORS.primary.default}
                                />
                            </View>
                            <View style={styles.settingTextContainer}>
                                <Text style={[styles.settingTitle, { color: colors.text }]}>Theme</Text>
                            </View>
                        </View>
                        <View style={styles.themeSwitcher}>
                            <TouchableOpacity
                                style={[
                                    styles.themeOption,
                                    theme === 'light' && styles.themeOptionActive,
                                    theme === 'light' && { backgroundColor: COLORS.primary.default }
                                ]}
                                onPress={() => setTheme('light')}
                            >
                                <MaterialCommunityIcons
                                    name="white-balance-sunny"
                                    size={16}
                                    color={theme === 'light' ? '#FFFFFF' : colors.subtext}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.themeOption,
                                    theme === 'dark' && styles.themeOptionActive,
                                    theme === 'dark' && { backgroundColor: COLORS.primary.default }
                                ]}
                                onPress={() => setTheme('dark')}
                            >
                                <MaterialCommunityIcons
                                    name="weather-night"
                                    size={16}
                                    color={theme === 'dark' ? '#FFFFFF' : colors.subtext}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.themeOption,
                                    theme === 'system' && styles.themeOptionActive,
                                    theme === 'system' && { backgroundColor: COLORS.primary.default }
                                ]}
                                onPress={() => setTheme('system')}
                            >
                                <MaterialCommunityIcons
                                    name="cog-outline"
                                    size={16}
                                    color={theme === 'system' ? '#FFFFFF' : colors.subtext}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Notifications Setting */}
                    <View style={[styles.settingItem, styles.settingItemBorderless]}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary.default}15` }]}>
                                <MaterialCommunityIcons
                                    name="bell-outline"
                                    size={20}
                                    color={COLORS.primary.default}
                                />
                            </View>
                            <Text style={[styles.settingTitle, { color: colors.text }]}>Notifications</Text>
                        </View>
                        <Switch
                            value={true}
                            trackColor={{
                                false: colors.border,
                                true: `${COLORS.primary.default}50`
                            }}
                            thumbColor={COLORS.primary.default}
                            ios_backgroundColor={colors.border}
                        />
                    </View>
                </View>

                <Text style={[styles.sectionHeader, { color: colors.subtext }]}>INFORMATION</Text>
                <View style={[styles.settingsGroup, { backgroundColor: colors.card }]}>
                    {/* App Version */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary.default}15` }]}>
                                <MaterialCommunityIcons
                                    name="cellphone-information"
                                    size={20}
                                    color={COLORS.primary.default}
                                />
                            </View>
                            <Text style={[styles.settingTitle, { color: colors.text }]}>App Version</Text>
                        </View>
                        <Text style={[styles.settingValue, { color: colors.subtext }]}>{APP_VERSION}</Text>
                    </View>

                    {/* Platform */}
                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary.default}15` }]}>
                                <MaterialCommunityIcons
                                    name="devices"
                                    size={20}
                                    color={COLORS.primary.default}
                                />
                            </View>
                            <Text style={[styles.settingTitle, { color: colors.text }]}>Platform</Text>
                        </View>
                        <Text style={[styles.settingValue, { color: colors.subtext }]}>
                            {Platform.OS === 'ios' ? 'iOS' : 'Android'}
                        </Text>
                    </View>

                    {/* Terms of Service */}
                    <TouchableOpacity
                        style={styles.settingItem}
                        onPress={() => {/* Handle Terms of Service */ }}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary.default}15` }]}>
                                <MaterialCommunityIcons
                                    name="file-document-outline"
                                    size={20}
                                    color={COLORS.primary.default}
                                />
                            </View>
                            <Text style={[styles.settingTitle, { color: colors.text }]}>Terms of Service</Text>
                        </View>
                        <View style={styles.chevronContainer}>
                            <Text style={[styles.linkText, { color: COLORS.primary.default }]}>View</Text>
                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={20}
                                color={colors.subtext}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Privacy Policy */}
                    <TouchableOpacity
                        style={[styles.settingItem, styles.settingItemBorderless]}
                        onPress={() => {/* Handle Privacy Policy */ }}
                    >
                        <View style={styles.settingLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: `${COLORS.primary.default}15` }]}>
                                <MaterialCommunityIcons
                                    name="shield-account-outline"
                                    size={20}
                                    color={COLORS.primary.default}
                                />
                            </View>
                            <Text style={[styles.settingTitle, { color: colors.text }]}>Privacy Policy</Text>
                        </View>
                        <View style={styles.chevronContainer}>
                            <Text style={[styles.linkText, { color: COLORS.primary.default }]}>View</Text>
                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={20}
                                color={colors.subtext}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <View style={styles.logoutButtonContainer}>
                    <Button
                        title="Logout"
                        icon={<MaterialCommunityIcons name="logout" size={20} color="#FFFFFF" />}
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        size="large"
                        variant="primary"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    // Profile Styles
    profileContainer: {
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        marginBottom: SPACING.lg,
    },
    loadingContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyProfileContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyProfileIcon: {
        marginBottom: SPACING.sm,
    },
    emptyProfileText: {
        fontSize: FONT_SIZE.md,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    avatarContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    avatarText: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: FONT_WEIGHT.bold as any,
        color: '#FFFFFF',
    },
    profileDetails: {
        flex: 1,
    },
    profileName: {
        fontSize: FONT_SIZE.lg,
        fontWeight: FONT_WEIGHT.bold as any,
        marginBottom: SPACING.xs,
    },
    profileEmail: {
        fontSize: FONT_SIZE.md,
    },
    // Section Header
    sectionHeader: {
        fontSize: FONT_SIZE.sm,
        fontWeight: FONT_WEIGHT.semibold as any,
        marginBottom: SPACING.xs,
        marginTop: SPACING.md,
        marginLeft: SPACING.xs,
    },
    // Settings Group
    settingsGroup: {
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
        marginBottom: SPACING.sm,
    },
    // Setting Item
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },
    settingItemBorderless: {
        borderBottomWidth: 0,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    settingTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.medium as any,
    },
    settingValue: {
        fontSize: FONT_SIZE.sm,
        fontWeight: FONT_WEIGHT.medium as any,
        paddingVertical: SPACING.xs / 2,
        paddingHorizontal: SPACING.sm,
        borderRadius: RADIUS.sm,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    // Theme Switcher
    themeSwitcher: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: RADIUS.md,
        padding: 4,
    },
    themeOption: {
        width: 36,
        height: 36,
        borderRadius: RADIUS.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2,
    },
    themeOptionActive: {
        backgroundColor: COLORS.primary.default,
    },
    // Chevron Container
    chevronContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        fontSize: FONT_SIZE.sm,
        fontWeight: FONT_WEIGHT.medium as any,
        marginRight: SPACING.xs,
    },
    // Logout Button
    logoutButtonContainer: {
        marginTop: SPACING.lg,
    },
    logoutButton: {
        width: '100%',
    },
    settingTextContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    settingDescription: {
        fontSize: FONT_SIZE.xs,
        marginTop: 2,
    },
});

export default Settings; 