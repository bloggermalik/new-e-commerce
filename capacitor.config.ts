import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lenzoa.app',
  appName: 'Lenzoa',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,        // No auto hide
      splashImmersive: true,
      backgroundColor: "#ffffff",   // White background
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "large",
      spinnerColor: "#fa0000ff"
    }
  },
  webDir: 'public',
   server: {
    url: 'https://new-e-commerce-five.vercel.app',
    cleartext: false
  }
};

export default config;