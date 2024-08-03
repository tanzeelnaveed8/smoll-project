import axios from "axios";
import { Platform } from "react-native";
import { showMessage, hideMessage } from "react-native-flash-message";

console.log(process.env.EXPO_PUBLIC_API_URL);

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    console.log(config.data, config.baseURL, config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("err", error);

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
