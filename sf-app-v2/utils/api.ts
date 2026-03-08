import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { showMessage } from "react-native-flash-message";
import Config from "@/utils/config";

const api = axios.create({
  baseURL: Config.API_URL,
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
    const message = error.response?.data?.message;
    let msgStr = message;

    if (Array.isArray(message)) {
      msgStr = message[0];
    }

    // Network error (no response) – show clear message instead of logging undefined
    const isNetworkError = !error.response;
    if (isNetworkError) {
      const networkMsg =
        "Could not reach server. Check that the app API_URL in .env points to your backend and the server is running.";
      if (!error.config?.url?.includes("skiperr")) {
        showMessage({ message: networkMsg, type: "danger" });
      }
      throw error;
    }

    if (msgStr === "You've used your free consulatation call.") {
      throw { error, msgStr };
    }
    if (!error.config?.url?.includes("skiperr") && msgStr && !msgStr.toLowerCase().includes("not found")) {
      showMessage({ message: msgStr, type: "danger" });
    }
    throw error;
  }
);

export default api;
