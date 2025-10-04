import 'dotenv/config';

export default {
  expo: {
    name: "VetCare",
    slug: "VetCare",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "vetcare",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.disriego.VetCare"
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-web-browser"
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      apiUrlAndroid: process.env.API_URL_ANDROID,
      apiUrlIos: process.env.API_URL_IOS,
      apiUrlDevice: process.env.API_URL_DEVICE,
      apiUrlWeb: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: "80d61c11-4c68-4984-aea5-ae9c3f8cf4f1"
      }
    }
  }
}
