import { View, Text, Button } from "react-native";
import React from "react";
import auth from "@react-native-firebase/auth";

const Page = () => {
  return (
    <View>
      <Button title="Sign Out" onPress={() => auth().signOut()} />
    </View>
  );
};

export default Page;
