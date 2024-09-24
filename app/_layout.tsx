import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const router = useRouter();
  const segments = useSegments();

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    console.log("onAuthStateChanged", user);
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "683358713083-e015a3f0jvmar12n9dclgd8mr9qr6kr1.apps.googleusercontent.com",
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0]?.includes("(auth)");

    if (user && !inAuthGroup) {
      //@ts-ignore
      router.replace("/(auth)/home");
    } else if (!user && inAuthGroup) {
      router.replace("/");
    }
  }, [user, initializing]);

  if (initializing)
    return (
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
