# Premier Mobile Banking — iOS & Android Build Configuration

This directory contains the native mobile build setup for **Premier Mobile Banking**, supporting cross-platform compilation for **Apple iOS** (iPhone/iPad) and **Google Android** devices.

---

## 1. Native Build Pre-requisites

### For iOS:
- macOS with Xcode 15+ installed
- CocoaPods (`sudo gem install cocoapods`)
- Apple Developer Account (for device distribution/App Store)

### For Android:
- Android Studio Ladybug or newer
- Android SDK Platform 34+
- Java Development Kit (JDK 17)

---

## 2. Compiling with Expo & EAS Build

### Build Android APK (Direct Sideload or Testing)
```bash
cd mobile
npm install
npx eas-cli build --platform android --profile preview
```
This produces a signed standalone `.apk` ready to install on any physical Android phone or emulator.

### Build Android Production App Bundle (`.aab` for Google Play)
```bash
npx eas-cli build --platform android --profile production
```

### Build iOS Simulator `.tar.gz`
```bash
npx eas-cli build --platform ios --profile preview
```

### Build iOS Production Archive (`.ipa` for TestFlight / App Store)
```bash
npx eas-cli build --platform ios --profile production
```

---

## 3. Local Native Build (Bare Workflow / Prebuild)

To generate standalone `ios/` and `android/` native project directories:

```bash
cd mobile
npx expo prebuild
```

### Run on iOS Simulator:
```bash
npx expo run:ios
```

### Run on Android Device / Emulator:
```bash
npx expo run:android
```

---

## 4. Key Security Permissions Configured

- **Face ID & Biometrics**: `NSFaceIDUsageDescription` configured in `app.json` with fallback PIN authorization.
- **Biometric Permissions (Android)**: `android.permission.USE_BIOMETRIC` & `USE_FINGERPRINT`.
- **Network Security**: Enforces HTTPS/TLS 1.3 transport security.
- **Hardware Keystore / Secure Enclave**: Hardware-backed session token storage via `expo-secure-store`.
