import axios from "axios";
import { Platform } from "react-native";

const BFF_URL = "http://localhost:4001";

const webStorage = {
  getItem: async (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: async (key: string, value: string) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: async (key: string) => Promise.resolve(localStorage.removeItem(key)),
};

async function getToken() {
  if (Platform.OS === "web") {
    return webStorage.getItem("clerk-token");
  }
  const SecureStore = require("expo-secure-store");
  return SecureStore.getItemAsync("clerk-token");
}

const api = axios.create({
  baseURL: `${BFF_URL}/api`,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
