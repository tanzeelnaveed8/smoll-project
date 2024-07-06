import axios from "axios";
import { Platform } from "react-native";

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
    console.log("error", error);

    throw error;
  }
);

export default api;
