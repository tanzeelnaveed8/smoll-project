/**
 * App config from Expo extra (replaces react-native-config for Expo builds).
 * Demo values used when env vars or extra are missing so the app runs without .env.
 */
import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as {
  API_URL?: string;
  SOCKET_URL?: string;
  SENTRY_DSN?: string;
};

const DEMO_API = "https://api.example.com";
const DEMO_SOCKET = "https://socket.example.com";

export default {
  API_URL: extra.API_URL ?? DEMO_API,
  SOCKET_URL: extra.SOCKET_URL ?? DEMO_SOCKET,
  SENTRY_DSN: extra.SENTRY_DSN ?? "",
};
