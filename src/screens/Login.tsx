import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
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

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>

const Login = ({ navigation }: LoginScreenProps) => {
  const { appwrite, setIsLoggedIn, theme, colors } = useContext(AppwriteContext)
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isDarkTheme = theme === 'dark';
  const { width } = Dimensions.get('window');

  // Calculate bottom padding to avoid overlapping with navigation bar
  const bottomPadding = Math.max(insets.bottom, 20);

  const handleLogin = async () => {
    if (email.length < 1 || password.length < 1) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await appwrite.login({ email, password });
      if (response) {
        setIsLoggedIn(true);
      }
    } catch (e: any) {
      setIsLoading(false);
      setError(e.message || 'Login failed. Please check your credentials.');
    }
  }

  const navigateToSignup = () => {
    navigation.navigate('Signup');
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
          <View style={[styles.brandSection, { paddingTop: insets.top + SPACING.xl }]}>
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
              Welcome Back!
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.subtext }]}>
              Sign in to continue to your account
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
              placeholder="Enter your password"
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

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => {/* Handle forgot password */ }}
            >
              <Text style={[styles.forgotPasswordText, { color: COLORS.primary.default }]}>
                Forgot password?
              </Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              disabled={isLoading}
              loading={isLoading}
              variant="primary"
              size="large"
              icon={<MaterialCommunityIcons name="login" size={20} color="#FFFFFF" />}
              style={styles.loginButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={[styles.footerText, { color: colors.subtext }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={navigateToSignup} style={styles.signupLinkContainer}>
              <Text style={[styles.signupLink, { color: COLORS.primary.default }]}>
                Create one
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
  brandSection: {
    marginBottom: SPACING.xl,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: SPACING.xl,
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
    marginBottom: SPACING.lg,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
    marginTop: SPACING.xs,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium as any,
  },
  loginButton: {
    borderRadius: RADIUS.md,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZE.md,
  },
  signupLinkContainer: {
    marginLeft: SPACING.xs,
  },
  signupLink: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold as any,
  },
});

export default Login