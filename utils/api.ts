import axios from "axios";
import { Platform } from "react-native";
import { showMessage, hideMessage } from "react-native-flash-message";

const api = axios.create({
  baseURL:
    Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    let msgStr = message;

    if (Array.isArray(message)) {
      msgStr = message[0];
    }

    if (msgStr) {
      showMessage({
        message: msgStr,
        type: "danger",
      });
    }

    throw error;
  }
);

export default api;
