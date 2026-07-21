import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "nativewind";
import { View, Text, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const CLERK_PUBLISHABLE_KEY = "pk_test_ZmFpci1kYXNzaWUtNTUuY2xlcmsuYWNjb3VudHMuZGV2JA";

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch {
      return;
    }
  },
};

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
  );
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  useReactQueryDevTools(queryClient);

  const { colorScheme } = useColorScheme();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn && typeof isSignedIn !== "undefined") {
      router.replace("/auth");
    }
  }, [isSignedIn]);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              <Stack.Screen
                name="auth"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="fixture/[id]"
                options={{
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "light" ? "#FFFFFF" : "#1A1A1A",
                  },
                  headerLeft: () => (
                    <TouchableOpacity
                      className="-ml-4 p-2"
                      onPress={router.back}
                    >
                      <Ionicons
                        name="chevron-back-outline"
                        size={28}
                        color={
                          colorScheme === "light" ? "#000000" : "#FFFFFF"
                        }
                      />
                    </TouchableOpacity>
                  ),
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="league/[id]"
                options={{
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "light" ? "#9CA3AF" : "#1A1A1A",
                  },
                  headerLeft: () => (
                    <TouchableOpacity
                      className="-ml-4 p-2"
                      onPress={router.back}
                    >
                      <Ionicons
                        name="chevron-back-outline"
                        size={28}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  ),
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="team/[id]"
                options={{
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "light" ? "#9CA3AF" : "#1A1A1A",
                  },
                  headerLeft: () => (
                    <TouchableOpacity
                      className="-ml-4 p-2"
                      onPress={router.back}
                    >
                      <Ionicons
                        name="chevron-back-outline"
                        size={28}
                        color="#FFFFFF"
                      />
                    </TouchableOpacity>
                  ),
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="coach/[id]"
                options={{
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "light" ? "#9CA3AF" : "#1A1A1A",
                  },
                  headerLeft: () => (
                    <TouchableOpacity
                      className="-ml-4 p-2"
                      onPress={router.back}
                    >
                      <View className="flex-row items-center space-x-1">
                        <Ionicons
                          name="chevron-back-outline"
                          size={28}
                          color="#FFFFFF"
                        />
                        <Text className="text-xl text-white">Back</Text>
                      </View>
                    </TouchableOpacity>
                  ),
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="player/[id]"
                options={{
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "light" ? "#9CA3AF" : "#1A1A1A",
                  },
                  headerLeft: () => (
                    <TouchableOpacity
                      className="-ml-4 p-2"
                      onPress={router.back}
                    >
                      <View className="flex-row items-center space-x-1">
                        <Ionicons
                          name="chevron-back-outline"
                          size={28}
                          color="#FFFFFF"
                        />
                        <Text className="text-xl text-white">Back</Text>
                      </View>
                    </TouchableOpacity>
                  ),
                  headerShadowVisible: false,
                }}
              />
              <Stack.Screen
                name="settings"
                options={{
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "light" ? "#FFFFFF" : "#1A1A1A",
                  },
                  headerLeft: () => (
                    <TouchableOpacity
                      className="-ml-4 p-2"
                      onPress={router.back}
                    >
                      <Ionicons
                        name="chevron-back-outline"
                        size={28}
                        color={
                          colorScheme === "light" ? "#000000" : "#FFFFFF"
                        }
                      />
                    </TouchableOpacity>
                  ),
                  headerShadowVisible: false,
                }}
              />
            </Stack>
          </ThemeProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
