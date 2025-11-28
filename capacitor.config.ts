import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lenzoa.app',
  appName: 'Lenzoa',
  webDir: 'public',
   server: {
    url: 'https://new-e-commerce-five.vercel.app',
    cleartext: true
  }
};

export default config;
