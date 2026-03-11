import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.client.app',
  appName: 'client-app',
  webDir: 'dist',
  server: {
    // Use HTTP in the Android WebView so calls to http://10.0.2.2:5000
    // are not treated as mixed content and blocked.
    androidScheme: 'http',
  },
};

export default config;
