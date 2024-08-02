import React, { useEffect, useState } from "react";
import { Div, ScrollDiv, Text } from "react-native-magnus";
import {
  fontHauora,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import SettingBackButton from "@/components/settings/SettingBackButton";
import { IconUser, IconEditCircle } from "@tabler/icons-react-native";
import Container from "@/components/partials/Container";
import Layout from "@/components/app/Layout";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import ProfileOptionButton from "./ProfileOptionButton";

const SettingPersonalInfoScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { user } = useUserStore();

  return (
    <Layout
      showBack
      title="Personal Info"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <ScrollDiv style={styles.container} showsVerticalScrollIndicator={false}>
        <Div flex={1}>
          <Div
            mb={24}
            w={96}
            h={96}
            rounded={100}
            bg="#EFEFEF"
            justifyContent="flex-end"
            pb={15}
            position="relative"
            alignItems="center"
          >
            <IconUser size={64} color="#222222" strokeWidth={1.5} />

            <Div
              w={32}
              h={32}
              rounded={100}
              bg="#BFBFBF"
              position="absolute"
              right={-12}
              bottom={20}
              alignItems="center"
              justifyContent="center"
            >
              <IconEditCircle size={24} color="#222222" />
            </Div>
          </Div>

          <Text mb={4} fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
            Basic Details
          </Text>
          <Div mb={32}>
            <ProfileOptionButton
              title="Name"
              value={user?.name}
              editable
              onEdit={() => {
                navigation.navigate("EditInfoScreen", {
                  heading: "What should we call you?",
                  placeholder: "Name",
                  fieldKey: "name",
                  value: `${user?.name || ""}`,
                });
              }}
            />
            <ProfileOptionButton
              title="Email address"
              value={user?.email}
              varified={user?.isEmailVerified}
              editable
              onEdit={() => {
                navigation.navigate("AccountSetupEmailScreen", {
                  updateEmail: "true",
                });
              }}
            />
            <ProfileOptionButton
              title="Phone number"
              value={user?.phone}
              varified
            />
          </Div>

          <Div
            mb={4}
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
              Address
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AccountSetupAddressScreen", {
                  updating: "true",
                });
              }}
            >
              <Text fontSize={16} lineHeight={24} color="primary">
                Edit
              </Text>
            </TouchableOpacity>
          </Div>

          <Div>
            <ProfileOptionButton title="Flat/Villa No" value={user?.villa} />
            <ProfileOptionButton title="Street address" value={user?.address} />
            <ProfileOptionButton title="City" value={user?.country} />
            <ProfileOptionButton title="Postal code" value={user?.postalCode} />
          </Div>
        </Div>
      </ScrollDiv>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});

export default SettingPersonalInfoScreen;
