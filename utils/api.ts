import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { showMessage } from "react-native-flash-message";

const api = axios.create({
  baseURL: "https://staging-api.smoll.me",
  // baseURL: process.env.EXPO_PUBLIC_API_URL,

  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const storedToken = await AsyncStorage.getItem("accessToken");
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the request path is "/members/me?skiperrr"
    const message = error.response?.data?.message;
    let msgStr = message;

    if (Array.isArray(message)) {
      msgStr = message[0];
    }

    if (!error.config.url.includes("skiperr")) {
      if (msgStr) {
        if (!msgStr.toLowerCase().includes("not found")) {
          showMessage({
            message: msgStr,
            type: "danger",
          });
        }
      }
    }

    console.log(error, message);

    throw error;
  }
);

export default api;
