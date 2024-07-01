import axios from "axios";
import { Platform } from "react-native";
import { Toast, useToast } from "react-native-toast-notifications";

const BASE_URL =
  Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
