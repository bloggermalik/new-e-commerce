// import type { CapacitorConfig } from '@capacitor/cli';

// const config: CapacitorConfig = {
//   appId: 'com.lenzoa.app',
//   appName: 'Lenzoa',
//   plugins: {
//     SplashScreen: {
//       launchShowDuration: 1500,        // No auto hide
//       splashImmersive: true,
//       backgroundColor: "#ffffff",   // White background
//       androidScaleType: "CENTER_CROP",
//       showSpinner: true,
//       androidSpinnerStyle: "large",
//       iosSpinnerStyle: "large",
//       spinnerColor: "#fa0000ff"
//     }
//   },
//   webDir: 'public',
//    server: {
//     url: 'https://new-e-commerce-five.vercel.app',
//     cleartext: false,
//     androidScheme: "https"

//   }
// };

// export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lenzoa.app',
  appName: 'Lenzoa',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      splashImmersive: true,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "large",
      spinnerColor: "#fa0000ff"
    },
    CapacitorCookies: {
      enabled: true
    }
  },
  webDir: 'public',
  server: {
    url: 'https://new-e-commerce-five.vercel.app',
    cleartext: false,
    androidScheme: "https",
    allowNavigation: ['https://new-e-commerce-five.vercel.app', 'https://*.vercel.app']
  }
};

export default config;