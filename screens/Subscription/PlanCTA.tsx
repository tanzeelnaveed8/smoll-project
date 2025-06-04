import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauoraBold, fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { IconArrowRight } from "@tabler/icons-react-native";
import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-magnus";

const avatars = [
  { id: 1, uri: "https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg" },
  { id: 2, uri: "https://images.dog.ceo/breeds/labrador/n02099712_6901.jpg" },
  { id: 3, uri: "https://images.dog.ceo/breeds/spaniel-sussex/n02102480_5808.jpg" },
  { id: 4, uri: "https://images.dog.ceo/breeds/corgi-cardigan/n02113186_1030.jpg" },
];

const PlanCTA = ({
  petName,
  onButtonPress,
  loading,
}: {
  petName?: string;
  onButtonPress: () => void;
  loading?: boolean;
}) => {
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
        <Text color="#090A0A" fontFamily={fontHauoraSemiBold} fontSize="lg" ml={8}>
          4,000+ Joined
        </Text>
      </View>

      <ButtonPrimary
        borderWidth={2}
        borderColor="#222"
        textColor="#222"
        fontFamily={fontHauoraBold}
        bg="transparent"
        onPress={onButtonPress}
        loading={loading}
        py={14}
        appendIcon={<IconArrowRight color="#222" height={28} width={28} />}
      >
        Proceed
      </ButtonPrimary>
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
