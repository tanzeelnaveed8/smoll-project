import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-magnus";

const avatars = [
  { id: 1, uri: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, uri: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 3, uri: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, uri: "https://randomuser.me/api/portraits/men/4.jpg" },
];

const PlanCTA = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.avatarGroup}>
          {avatars.map((avatar, index) => (
            <Image
              key={avatar.id}
              source={{ uri: avatar.uri }}
              style={[styles.avatar, { marginLeft: index === 0 ? 0 : -12 }]}
            />
          ))}
        </View>
        <Text fontFamily={fontHauoraSemiBold} fontSize="lg" ml={8}>
          24,000+ Joined
        </Text>
      </View>

      <ButtonPrimary onPress={() => {}}>Pay for the Plan</ButtonPrimary>
    </View>
  );
};

export default PlanCTA;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#faf8f5",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarGroup: {
    flexDirection: "row",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
