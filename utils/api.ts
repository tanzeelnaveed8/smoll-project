import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Platform } from "react-native";
import { showMessage } from "react-native-flash-message";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    // console.log(config.data, config.baseURL, config.url);

    const storedToken = await AsyncStorage.getItem("accessToken"); // Retrieve the token
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`; // Set the Authorization header
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
    console.log("err", error, error.response);

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
