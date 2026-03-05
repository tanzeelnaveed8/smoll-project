// Expo app config with env exposed via extra (demo values for missing env)
// Replace with real .env or EAS env later.
const DEMO_API_URL = process.env.API_URL || "https://api.example.com";
const DEMO_SOCKET_URL = process.env.SOCKET_URL || "https://socket.example.com";
const DEMO_SENTRY_DSN = process.env.SENTRY_DSN || "";

module.exports = {
  expo: {
    name: "main",
    displayName: "smoll",
    slug: "smoll",
    version: "1.0.4",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.outlyze.sf",
    },
    android: {
      package: "com.seldom.small_friend",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    extra: {
      API_URL: DEMO_API_URL,
      SOCKET_URL: DEMO_SOCKET_URL,
      SENTRY_DSN: DEMO_SENTRY_DSN,
    },
  },
};
