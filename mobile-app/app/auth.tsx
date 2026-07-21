import { useOAuth, useUser, useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import api from "@/lib/api/client";

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { startOAuthFlow: startGoogleAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startAppleAuth } = useOAuth({ strategy: "oauth_apple" });

  useEffect(() => {
    if (isSignedIn && user) {
      syncWithBackend();
    }
  }, [isSignedIn, user]);

  async function syncWithBackend() {
    try {
      const token = await getToken();
      if (token) {
        await SecureStore.setItemAsync("clerk-token", token);
      }
      await api.post("/auth/clerk");
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Sync failed:", err);
    }
  }

  async function handleGoogleSignIn() {
    try {
      const { createdSessionId, setActive } = await startGoogleAuth();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
  }

  async function handleAppleSignIn() {
    try {
      const { createdSessionId, setActive } = await startAppleAuth();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("Apple sign-in error:", err);
    }
  }

  if (isSignedIn) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-[#1A1A1A]">
        <Text className="text-lg text-gray-500">Signing in...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-8 dark:bg-[#1A1A1A]">
      <Text className="mb-2 text-4xl font-bold dark:text-white">FotMob</Text>
      <Text className="mb-12 text-lg text-gray-500 dark:text-gray-400">
        Sign in to follow your teams
      </Text>

      <TouchableOpacity
        onPress={handleGoogleSignIn}
        className="mb-4 w-full rounded-xl bg-white py-4 shadow-md dark:bg-[#272727]"
        style={{ borderWidth: 1, borderColor: "#E5E5E5" }}
      >
        <Text className="text-center text-base font-semibold dark:text-white">
          Continue with Google
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleAppleSignIn}
        className="w-full rounded-xl bg-black py-4"
      >
        <Text className="text-center text-base font-semibold text-white">
          Continue with Apple
        </Text>
      </TouchableOpacity>
    </View>
  );
}
