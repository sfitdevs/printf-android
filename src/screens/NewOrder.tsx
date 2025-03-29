import React, { useContext, useState, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Platform,
    Alert,
    Animated,
    Easing,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppwriteContext } from '../appwrite/AppWriteContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../routes/AppStack';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, COLORS } from '../components/StyleGuide';
import Header from '../components/Header';
import Button from '../components/Button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type NewOrderScreenProps = NativeStackScreenProps<AppStackParamList, 'NewOrder'>;

// Form section component
interface FormSectionProps {
    title: string;
    icon: string;
    children: React.ReactNode;
    textColor: string;
}

// Form section component
const FormSection = ({
    title,
    icon,
    textColor,
    children
}) => {
    const { colors, isDarkTheme } = useContext(AppwriteContext);

    return (
        <View style={[
            styles.sectionContainer,
            {
                backgroundColor: colors.card,
                borderColor: colors.border
            }
        ]}>
            {(title || icon) && (
                <View style={styles.sectionHeader}>
                    {icon && (
                        <View style={styles.sectionIconContainer}>
                            <MaterialCommunityIcons
                                name={icon}
                                size={20}
                                color={colors.primary}
                            />
                        </View>
                    )}
                    {title && (
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            {title}
                        </Text>
                    )}
                </View>
            )}
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );
};

// Form input component
interface FormInputProps {
    label: string;
    placeholder: string;
    icon: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: "default" | "numeric" | "email-address";
    textAlign?: 'left' | 'center' | 'right';
    error?: boolean;
    errorMessage?: string;
    containerStyle?: any;
    width?: number;
    maxLength?: number;
    showCounter?: boolean;
}

// Form input component
const FormInput = ({
    label,
    placeholder,
    icon,
    value,
    onChangeText,
    keyboardType = 'default',
    error,
    errorMessage,
    containerStyle,
    textAlign = 'left',
    width,
    maxLength,
    showCounter = false,
}: FormInputProps) => {
    const { colors, isDarkTheme } = useContext(AppwriteContext);
    const [isFocused, setIsFocused] = useState(false);
    const errorOpacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(errorOpacity, {
            toValue: error ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [error]);

    return (
        <View style={[styles.inputContainer, containerStyle]}>
            <View style={styles.labelContainer}>
                {icon && (
                    <MaterialCommunityIcons
                        name={icon}
                        size={18}
                        color={isFocused ? colors.primary : colors.text}
                        style={{ marginRight: SPACING.sm }}
                    />
                )}
                <Text style={[styles.inputLabel, { color: colors.text }]}>{label}</Text>
                {showCounter && maxLength && (
                    <Text style={[styles.counter, { color: colors.subtext }]}>
                        {`${value?.length || 0}/${maxLength}`}
                    </Text>
                )}
            </View>

            <View style={[
                styles.inputWrapper,
                {
                    borderColor: error ? COLORS.error : (isFocused ? colors.primary : colors.border),
                    backgroundColor: isDarkTheme ? colors.card : colors.background,
                    width: width,
                }
            ]}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={colors.subtext}
                    value={value}
                    onChangeText={onChangeText}
                    style={[
                        styles.input,
                        {
                            color: colors.text,
                            textAlign
                        }
                    ]}
                    keyboardType={keyboardType}
                    maxLength={maxLength}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </View>

            {error && errorMessage && (
                <Animated.View style={{ opacity: errorOpacity }}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                </Animated.View>
            )}
        </View>
    );
};

// Toggle option component
interface ToggleOptionProps {
    label: string;
    options: { value: string; label: string }[];
    selectedOption: string;
    onOptionChange: (value: string) => void;
    iconName: string;
    iconColor?: string;
}

const ToggleOption = ({
    label,
    options,
    selectedOption,
    onOptionChange,
    iconName,
    iconColor,
}: ToggleOptionProps) => {
    const { colors, isDarkTheme } = useContext(AppwriteContext);
    const animatedValues = useRef(options.map(() => new Animated.Value(0))).current;

    // Set the initial animations based on selected option
    React.useEffect(() => {
        options.forEach((option, index) => {
            Animated.timing(animatedValues[index], {
                toValue: option.value === selectedOption ? 1 : 0,
                duration: 200,
                easing: Easing.out(Easing.ease),
                useNativeDriver: false,
            }).start();
        });
    }, [selectedOption]);

    return (
        <View style={styles.toggleOptionContainer}>
            <View style={styles.toggleLabelContainer}>
                <View
                    style={[
                        styles.toggleIconContainer,
                        { backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                    ]}
                >
                    <MaterialCommunityIcons name={iconName} size={18} color={iconColor || colors.primary} />
                </View>
                <Text style={[styles.toggleLabel, { color: colors.text }]}>{label}</Text>
            </View>

            <View
                style={[
                    styles.toggleContainer,
                    { backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' },
                ]}
            >
                {options.map((option, index) => {
                    const isActive = selectedOption === option.value;
                    let icon = null;

                    switch (option.value) {
                        case 'portrait':
                            icon = 'page-layout-header';
                            break;
                        case 'landscape':
                            icon = 'page-layout-sidebar-right';
                            break;
                        case 'bw':
                            icon = 'circle-slice-8';
                            break;
                        case 'color':
                            icon = 'palette';
                            break;
                    }

                    // Interpolate animations
                    const backgroundColor = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['transparent', colors.primary]
                    });

                    const textColor = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [colors.text, '#FFFFFF']
                    });

                    const scale = animatedValues[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.05]
                    });

                    return (
                        <TouchableOpacity
                            key={option.value}
                            activeOpacity={0.7}
                            onPress={() => onOptionChange(option.value)}
                            style={{ flex: 1 }}
                        >
                            <Animated.View
                                style={[
                                    styles.toggleOption,
                                    {
                                        backgroundColor: backgroundColor,
                                        transform: [{ scale }]
                                    },
                                ]}
                            >
                                {icon && (
                                    <MaterialCommunityIcons
                                        name={icon}
                                        size={16}
                                        color={isActive ? '#FFFFFF' : colors.text}
                                        style={styles.toggleOptionIcon}
                                    />
                                )}
                                <Animated.Text
                                    style={[
                                        styles.toggleText,
                                        isActive && styles.toggleOptionActive,
                                        { color: textColor }
                                    ]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {option.label}
                                </Animated.Text>
                            </Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const NewOrder = ({ navigation }: NewOrderScreenProps) => {
    const { theme, colors } = useContext(AppwriteContext);
    const insets = useSafeAreaInsets();
    const isDarkTheme = theme === 'dark';

    // Form state
    const [orderName, setOrderName] = useState('');
    const [nameError, setNameError] = useState('');
    const [copies, setCopies] = useState('1');
    const [isPortrait, setIsPortrait] = useState(true);
    const [isColorPrint, setIsColorPrint] = useState(true);
    const [pageFormat, setPageFormat] = useState('a4');
    const [pageRangeStart, setPageRangeStart] = useState('');
    const [pageRangeEnd, setPageRangeEnd] = useState('');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [copiesError, setCopiesError] = useState(false);
    const [loading, setLoading] = useState(false);

    // Calculate bottom padding to avoid overlapping with navigation bar
    const bottomPadding = Math.max(insets.bottom, 20);

    const handleBack = () => {
        navigation.goBack();
    };

    const handleCopiesChange = (text: string) => {
        setCopies(text);

        if (!text.trim() || parseInt(text, 10) < 1) {
            setCopiesError(true);
        } else {
            setCopiesError(false);
        }
    };

    const handleSubmit = () => {
        // Validate inputs
        let hasError = false;

        if (!orderName.trim()) {
            setNameError('Order name is required');
            hasError = true;
        }

        if (!copies.trim() || parseInt(copies, 10) < 1) {
            setCopiesError(true);
            hasError = true;
        }

        if (!selectedFile) {
            Alert.alert('Error', 'Please select a document to print');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        // Prepare order data
        const orderData = {
            name: orderName.trim(),
            copies: parseInt(copies, 10),
            orientation: isPortrait ? 'portrait' : 'landscape',
            colorFormat: isColorPrint ? 'color' : 'bw',
            pageFormat: pageFormat,
            pageRange: {
                from: pageRangeStart ? parseInt(pageRangeStart, 10) : null,
                to: pageRangeEnd ? parseInt(pageRangeEnd, 10) : null
            },
            file: selectedFile
        };

        // Show loading state
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);

            // Navigate back to orders screen
            navigation.navigate('OrderDetails', { orderId: 'new-order-123' });

            // Show success message
            Alert.alert('Success', 'Your order has been created successfully');
        }, 1500);
    };

    const handleUploadDocument = () => {
        // In a real app, this would open a document picker
        // For now, we'll just simulate selecting a file
        setSelectedFile('document.pdf');
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={isDarkTheme ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />

            {/* Header with back button */}
            <Header
                title="Create New Order"
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
                {/* Order Information Section */}
                <FormSection
                    title="Order Information"
                    icon="file-document-outline"
                    textColor={colors.text}
                    children={
                        <>
                            <FormInput
                                label="Order Name"
                                placeholder="Enter order name"
                                value={orderName}
                                onChangeText={(text) => {
                                    setOrderName(text);
                                    if (text.trim()) {
                                        setNameError('');
                                    }
                                }}
                                textAlign="left"
                                error={!!nameError}
                                errorMessage={nameError}
                                containerStyle={styles.inputContainer}
                                icon="tag-outline"
                            />

                            {/* Update the copies container and styles */}
                            <View style={styles.copiesContainer}>
                                <View style={styles.copiesRow}>
                                    <View style={styles.labelContainer}>
                                        <MaterialCommunityIcons
                                            name="content-copy"
                                            size={18}
                                            color={colors.text}
                                            style={{ marginRight: SPACING.sm }}
                                        />
                                        <Text style={[styles.inputLabel, { color: colors.text }]}>Number of Copies</Text>
                                    </View>

                                    <View style={styles.copiesControlsWrapper}>
                                        <TouchableOpacity
                                            style={[
                                                styles.copiesButton,
                                                {
                                                    borderColor: colors.border,
                                                    backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                                                }
                                            ]}
                                            onPress={() => {
                                                if (parseInt(copies, 10) > 1) {
                                                    setCopies(String(parseInt(copies, 10) - 1));
                                                }
                                            }}
                                        >
                                            <MaterialCommunityIcons name="minus" size={16} color={colors.text} />
                                        </TouchableOpacity>

                                        <TextInput
                                            style={[
                                                styles.copiesInput,
                                                {
                                                    color: colors.text,
                                                    borderColor: copiesError ? COLORS.error : colors.border,
                                                    backgroundColor: isDarkTheme ? colors.card : colors.background
                                                }
                                            ]}
                                            value={copies}
                                            onChangeText={handleCopiesChange}
                                            keyboardType="numeric"
                                            textAlign="center"
                                        />

                                        <TouchableOpacity
                                            style={[
                                                styles.copiesButton,
                                                {
                                                    borderColor: colors.border,
                                                    backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                                                }
                                            ]}
                                            onPress={() => {
                                                setCopies(String(parseInt(copies, 10) + 1));
                                            }}
                                        >
                                            <MaterialCommunityIcons name="plus" size={16} color={colors.text} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {copiesError && (
                                    <Text style={styles.errorText}>Minimum 1 copy required</Text>
                                )}
                            </View>
                        </>
                    }
                />

                {/* Print Settings Section */}
                <FormSection
                    title="Print Settings"
                    icon="printer-settings"
                    textColor={colors.text}
                    children={
                        <>
                            {/* Orientation */}
                            <ToggleOption
                                label="Orientation"
                                options={[{ value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' }]}
                                selectedOption={isPortrait ? 'portrait' : 'landscape'}
                                onOptionChange={(value) => setIsPortrait(value === 'portrait')}
                                iconName="rotate-3d"
                                iconColor={colors.primary}
                            />

                            {/* Color Format */}
                            <ToggleOption
                                label="Color Format"
                                options={[
                                    { value: 'bw', label: 'B&W' },
                                    { value: 'color', label: 'Color' }
                                ]}
                                selectedOption={isColorPrint ? 'color' : 'bw'}
                                onOptionChange={(value) => setIsColorPrint(value === 'color')}
                                iconName="palette"
                                iconColor={colors.primary}
                            />

                            {/* Page Format */}
                            <ToggleOption
                                label="Page Format"
                                options={[
                                    { value: 'a4', label: 'A4' },
                                    { value: 'a3', label: 'A3' },
                                    { value: 'letter', label: 'Letter' },
                                    { value: 'legal', label: 'Legal' }
                                ]}
                                selectedOption={pageFormat}
                                onOptionChange={setPageFormat}
                                iconName="file-document-outline"
                                iconColor={colors.primary}
                            />

                            {/* Page Range */}
                            <View style={{ marginBottom: SPACING.md }}>
                                <View style={styles.labelContainer}>
                                    <MaterialCommunityIcons
                                        name="book-open-page-variant"
                                        size={18}
                                        color={colors.text}
                                        style={{ marginRight: SPACING.sm }}
                                    />
                                    <Text style={[styles.inputLabel, { color: colors.text }]}>
                                        Page Range
                                    </Text>
                                </View>
                                <View style={styles.pageRangeContainer}>
                                    <View style={[
                                        styles.inputWrapper,
                                        {
                                            borderColor: colors.border,
                                            backgroundColor: isDarkTheme ? colors.card : colors.background,
                                            width: 90,
                                        }
                                    ]}>
                                        <TextInput
                                            placeholder="From"
                                            placeholderTextColor={colors.subtext}
                                            value={pageRangeStart}
                                            onChangeText={setPageRangeStart}
                                            style={[
                                                styles.input,
                                                { color: colors.text, textAlign: 'center' }
                                            ]}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                    <Text style={[styles.pageRangeSeparator, { color: colors.text }]}>
                                        to
                                    </Text>
                                    <View style={[
                                        styles.inputWrapper,
                                        {
                                            borderColor: colors.border,
                                            backgroundColor: isDarkTheme ? colors.card : colors.background,
                                            width: 90,
                                        }
                                    ]}>
                                        <TextInput
                                            placeholder="To"
                                            placeholderTextColor={colors.subtext}
                                            value={pageRangeEnd}
                                            onChangeText={setPageRangeEnd}
                                            style={[
                                                styles.input,
                                                { color: colors.text, textAlign: 'center' }
                                            ]}
                                            keyboardType="numeric"
                                        />
                                    </View>
                                </View>
                            </View>
                        </>
                    }
                />

                {/* Document Upload Section */}
                <FormSection
                    title="Document Upload"
                    icon="cloud-upload"
                    textColor={colors.text}
                    children={
                        <TouchableOpacity
                            style={[styles.uploadButton, {
                                borderColor: colors.border,
                                borderStyle: 'dashed',
                                backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)'
                            }]}
                            onPress={handleUploadDocument}
                            activeOpacity={0.7}
                        >
                            {selectedFile ? (
                                <View style={styles.selectedFileContainer}>
                                    <View style={[styles.selectedFileIconContainer, { backgroundColor: `${COLORS.primary.default}15` }]}>
                                        <MaterialCommunityIcons
                                            name="file-pdf-box"
                                            size={30}
                                            color={COLORS.primary.default}
                                        />
                                    </View>
                                    <View style={styles.selectedFileDetails}>
                                        <Text style={[styles.selectedFileName, { color: colors.text }]}>
                                            {selectedFile}
                                        </Text>
                                        <Text style={[styles.selectedFileSize, { color: colors.subtext }]}>
                                            2.4 MB
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.changeFileButton, { backgroundColor: `${COLORS.primary.default}15` }]}
                                        onPress={handleUploadDocument}
                                    >
                                        <Text style={{ color: COLORS.primary.default, fontWeight: FONT_WEIGHT.medium as any }}>Change</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.uploadPlaceholder}>
                                    <View style={[styles.uploadIcon, { backgroundColor: `${COLORS.primary.default}15` }]}>
                                        <MaterialCommunityIcons
                                            name="file-upload-outline"
                                            size={32}
                                            color={COLORS.primary.default}
                                        />
                                    </View>
                                    <Text style={[styles.uploadText, { color: colors.text }]}>
                                        Tap to upload document
                                    </Text>
                                    <Text style={[styles.uploadSubtext, { color: colors.subtext }]}>
                                        PDF, DOC, DOCX (max 10MB)
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    }
                />

                {/* Submit Button */}
                <View style={styles.submitButtonContainer}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <>
                                <MaterialCommunityIcons name="printer" size={20} color="#FFFFFF" />
                                <Text style={styles.submitButtonText}>Create Order</Text>
                            </>
                        )}
                    </TouchableOpacity>
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
        padding: SPACING.lg,
    },
    // Form Section Styles
    sectionContainer: {
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        marginBottom: SPACING.lg,
        overflow: 'hidden',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    sectionIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(234,88,12,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.semibold as any,
    },
    sectionContent: {
        padding: SPACING.md,
    },
    // Input Styles
    inputContainer: {
        marginBottom: SPACING.md,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xs,
    },
    inputLabel: {
        fontSize: FONT_SIZE.sm,
        fontWeight: FONT_WEIGHT.medium as any,
    },
    inputWrapper: {
        borderWidth: 1,
        borderRadius: RADIUS.md,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: 0,
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.regular as any,
    },
    // Toggle Styles
    toggleOptionContainer: {
        marginBottom: SPACING.md,
    },
    toggleLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    toggleIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    toggleLabel: {
        fontSize: FONT_SIZE.sm,
        fontWeight: FONT_WEIGHT.medium as any,
    },
    toggleContainer: {
        flexDirection: 'row',
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        padding: 2,
        height: 42,
    },
    toggleOption: {
        flex: 1,
        height: '100%',
        paddingHorizontal: SPACING.sm,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.md,
        marginHorizontal: 2,
        flexDirection: 'row',
    },
    toggleOptionActive: {
        fontWeight: FONT_WEIGHT.semibold as any,
    },
    toggleText: {
        fontSize: FONT_SIZE.xs,
        fontWeight: FONT_WEIGHT.medium as any,
    },
    toggleOptionIcon: {
        marginRight: 4,
    },
    // Page Range Styles
    pageRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    pageRangeSeparator: {
        marginHorizontal: SPACING.md,
        fontSize: FONT_SIZE.sm,
        fontWeight: FONT_WEIGHT.medium as any,
    },
    // Upload Styles
    uploadButton: {
        borderRadius: RADIUS.md,
        borderWidth: 2,
        overflow: 'hidden',
    },
    uploadPlaceholder: {
        padding: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadIcon: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    uploadText: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.medium as any,
        marginBottom: SPACING.xs,
    },
    uploadSubtext: {
        fontSize: FONT_SIZE.sm,
    },
    selectedFileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
    },
    selectedFileIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedFileDetails: {
        flex: 1,
        marginLeft: SPACING.md,
    },
    selectedFileName: {
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.medium as any,
    },
    selectedFileSize: {
        fontSize: FONT_SIZE.xs,
        marginTop: 2,
    },
    changeFileButton: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: RADIUS.sm,
    },
    // Submit Button
    submitButtonContainer: {
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        width: '100%',
    },
    submitButton: {
        backgroundColor: COLORS.primary.default,
        borderRadius: RADIUS.md,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: FONT_SIZE.md,
        fontWeight: FONT_WEIGHT.semibold as any,
        marginLeft: SPACING.sm,
    },
    errorText: {
        marginTop: SPACING.xs,
        marginLeft: SPACING.md,
        fontSize: FONT_SIZE.sm,
        fontWeight: FONT_WEIGHT.medium as any,
        color: COLORS.error,
    },
    counter: {
        marginLeft: 'auto',
        fontSize: FONT_SIZE.xs,
    },
    // Update the copies container and styles
    copiesContainer: {
        marginBottom: SPACING.md,
    },
    copiesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    copiesControlsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    copiesButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    copiesInput: {
        width: 50,
        height: 32,
        borderWidth: 1,
        borderRadius: RADIUS.sm,
        marginHorizontal: SPACING.xs,
        padding: 0,
        fontSize: FONT_SIZE.md,
        textAlign: 'center',
    },
});

export default NewOrder; 