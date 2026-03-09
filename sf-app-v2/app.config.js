// Expo app config with env exposed via extra (demo values for missing env)
// Load .env so API_URL and SOCKET_URL are available when running expo start / expo run:android.
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const DEMO_API_URL = process.env.API_URL || "https://api.example.com";
const DEMO_SOCKET_URL = process.env.SOCKET_URL || "https://socket.example.com";
const DEMO_SENTRY_DSN = process.env.SENTRY_DSN || "";
const DEV_BYPASS_OTP = process.env.DEV_BYPASS_OTP || "false";

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
      DEV_BYPASS_OTP,
    },
  },
};
