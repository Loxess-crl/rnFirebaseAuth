import { useState } from "react";
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import auth, { firebase } from "@react-native-firebase/auth";
import { FirebaseError } from "firebase/app";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);

    try {
      await auth().createUserWithEmailAndPassword(email, password);
      alert("Account created");
    } catch (e) {
      const err = e as FirebaseError;
      alert("Registration Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);

    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      const err = e as FirebaseError;
      alert("Login Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { data } = await GoogleSignin.signIn();
      const idToken = data?.idToken;

      if (!idToken) {
        throw new Error("No idToken");
      }
      const googleCredential =
        firebase.auth.GoogleAuthProvider.credential(idToken);

      auth().signInWithCredential(googleCredential);
    } catch (e) {
      const err = e as FirebaseError;
      alert("Login Failedddd: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator size={"small"} style={{ margin: 28 }} />
        ) : (
          <>
            <Button onPress={signIn} title="Login" />
            <Button onPress={signUp} title="Create account" />
          </>
        )}
      </KeyboardAvoidingView>
      <View style={{ marginTop: 10 }}>
        <Button title="Sign with Google" onPress={signInWithGoogle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});
