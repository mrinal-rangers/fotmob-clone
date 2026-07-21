import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const BFF_URL = Platform.OS === "web" ? "http://localhost:4001" : "http://localhost:4001";

const api = axios.create({
  baseURL: `${BFF_URL}/api`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("clerk-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
