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

const API_URL = extra.API_URL ?? DEMO_API;
const SOCKET_URL = extra.SOCKET_URL ?? DEMO_SOCKET;

/** Always false: app uses real backend only, no demo/mock data. */
export const DEMO_MODE = false;

export default {
  API_URL,
  SOCKET_URL,
  SENTRY_DSN: extra.SENTRY_DSN ?? "",
};
