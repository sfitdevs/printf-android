import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useContext, useState } from 'react'
import { AppwriteContext } from '../appwrite/AppWriteContext'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../routes/AuthStack'
import Input from '../components/Input'
import Button from '../components/Button'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, COLORS } from '../components/StyleGuide'

type SignupScreenProps = NativeStackScreenProps<AuthStackParamList, 'Signup'>

const Signup = ({ navigation }: SignupScreenProps) => {
  const { appwrite, setIsLoggedIn, theme, colors } = useContext(AppwriteContext)
  const insets = useSafeAreaInsets();

  const [error, setError] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [repeatPassword, setRepeatPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isDarkTheme = theme === 'dark';
  const { width } = Dimensions.get('window');

  // Calculate bottom padding to avoid overlapping with navigation bar
  const bottomPadding = Math.max(insets.bottom, 20);

  const handleSignup = async () => {
    if (name.length < 1 || email.length < 1 || password.length < 1 || repeatPassword.length < 1) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await appwrite.createAccount({ email, password, name });
      if (response) {
        setIsLoggedIn(true);
      }
    } catch (e: any) {
      setIsLoading(false);
      setError(e.message || 'Failed to create account. Please try again.');
    }
  }

  const navigateToLogin = () => {
    navigation.navigate('Login');
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background }
      ]}
    >
      <StatusBar
        barStyle={isDarkTheme ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            { paddingBottom: bottomPadding + SPACING.lg }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Section */}
          <View style={[styles.brandSection, { paddingTop: insets.top + SPACING.lg }]}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={navigateToLogin}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary.default} />
              </TouchableOpacity>
              <View style={styles.emptySpace} />
            </View>

            <View style={styles.brandContainer}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>P</Text>
              </View>
              <View style={styles.brandTextContainer}>
                <Text style={[styles.brandTitle, { color: colors.text }]}>
                  PrintF
                </Text>
                <Text style={[styles.brandSubtitle, { color: colors.subtext }]}>
                  Your Printing Partner
                </Text>
              </View>
            </View>
          </View>

          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeTitle, { color: colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.subtext }]}>
              Fill in your details to get started
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: `${COLORS.error}10`, borderColor: `${COLORS.error}30` }]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={20} color={COLORS.error} style={styles.errorIcon} />
                <Text style={[styles.errorText, { color: COLORS.error }]}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              autoCapitalize="words"
              leftIcon={<MaterialCommunityIcons name="account-outline" size={20} color={colors.subtext} />}
              labelStyle={{ color: colors.text }}
              inputContainerStyle={{
                borderColor: colors.border,
                backgroundColor: colors.card
              }}
              inputStyle={{ color: colors.text }}
            />

            <Input
              label="Email Address"
              placeholder="example@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<MaterialCommunityIcons name="email-outline" size={20} color={colors.subtext} />}
              error={email.length > 0 && !email.includes('@') ? 'Please enter a valid email' : ''}
              labelStyle={{ color: colors.text }}
              inputContainerStyle={{
                borderColor: colors.border,
                backgroundColor: colors.card
              }}
              inputStyle={{ color: colors.text }}
            />

            <Input
              label="Password"
              placeholder="Create a strong password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              isPassword
              leftIcon={<MaterialCommunityIcons name="lock-outline" size={20} color={colors.subtext} />}
              labelStyle={{ color: colors.text }}
              inputContainerStyle={{
                borderColor: colors.border,
                backgroundColor: colors.card
              }}
              inputStyle={{ color: colors.text }}
            />

            <Input
              label="Confirm Password"
              placeholder="Repeat your password"
              value={repeatPassword}
              onChangeText={(text) => {
                setRepeatPassword(text);
                setError('');
              }}
              isPassword
              leftIcon={<MaterialCommunityIcons name="lock-check-outline" size={20} color={colors.subtext} />}
              error={
                repeatPassword.length > 0 && password !== repeatPassword
                  ? 'Passwords do not match'
                  : ''
              }
              labelStyle={{ color: colors.text }}
              inputContainerStyle={{
                borderColor: colors.border,
                backgroundColor: colors.card
              }}
              inputStyle={{ color: colors.text }}
            />

            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { color: colors.subtext }]}>
                By signing up, you agree to our{' '}
                <Text style={[styles.termsLink, { color: COLORS.primary.default }]}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={[styles.termsLink, { color: COLORS.primary.default }]}>
                  Privacy Policy
                </Text>
              </Text>
            </View>

            <Button
              title="Create Account"
              onPress={handleSignup}
              disabled={isLoading}
              loading={isLoading}
              variant="primary"
              size="large"
              icon={<MaterialCommunityIcons name="account-plus" size={20} color="#FFFFFF" />}
              style={styles.signupButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={[styles.footerText, { color: colors.subtext }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={navigateToLogin} style={styles.loginLinkContainer}>
              <Text style={[styles.loginLink, { color: COLORS.primary.default }]}>
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  emptySpace: {
    width: 36, // Same as back button width for balance
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandSection: {
    marginBottom: SPACING.lg,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  brandTextContainer: {
    marginLeft: SPACING.md,
  },
  brandTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold as any,
  },
  brandSubtitle: {
    fontSize: FONT_SIZE.sm,
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary.default,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold as any,
    color: '#FFFFFF',
  },
  welcomeSection: {
    marginBottom: SPACING.lg,
  },
  welcomeTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold as any,
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZE.md,
  },
  formSection: {
    marginBottom: SPACING.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  errorIcon: {
    marginRight: SPACING.xs,
  },
  errorText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium as any,
  },
  termsContainer: {
    marginVertical: SPACING.md,
  },
  termsText: {
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: FONT_WEIGHT.medium as any,
  },
  signupButton: {
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  footerText: {
    fontSize: FONT_SIZE.md,
  },
  loginLinkContainer: {
    marginLeft: SPACING.xs,
  },
  loginLink: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold as any,
  },
});

export default Signup