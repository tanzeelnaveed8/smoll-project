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

const SettingPersonalInfoScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { user } = useUserStore();
  console.log("user", user);

  // const [userDetials, setUserDetails] = useState({ ...user });
  // useEffect(() => {
  //   const obj = {
  //     name: user?.name,
  //     email: user?.email,
  //     villa: user?.villa,
  //     city: user?.city,
  //     country: user?.country,
  //   };
  //   setUserDetails(obj);
  // }, [user]);

  return (
    <Layout
      showBack
      backBtnText=""
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
            <Option
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
            <Option
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
            <Option title="Phone number" value={user?.phone} varified />
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
            <Option title="Flat/Villa No" value={user?.villa} />
            <Option title="Street address" value={user?.address} />
            <Option title="City" value={user?.country} />
            <Option title="Postal code" value={user?.postalCode} />
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

type OptionPropTypes = {
  title: string;
  value: string | undefined | null;
  varified?: boolean;
  editable?: boolean;
  onEdit?: () => void;
};
const Option = (props: OptionPropTypes) => {
  const { title, value, varified, onEdit, editable } = props;
  return (
    <React.Fragment>
      <Div
        w="full"
        py={12}
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="#E0E0E0"
      >
        <Div>
          <Text
            color="#494949"
            fontSize="sm"
            fontFamily={fontHauoraMedium}
            lineHeight={16}
          >
            {title}
          </Text>
          <Text color="#222222" fontSize={18} lineHeight={24}>
            {value}
          </Text>
        </Div>

        {editable && (
          <TouchableOpacity onPress={onEdit}>
            <Text fontSize={16} lineHeight={24} color="primary">
              {value ? "Edit" : "Add"}
            </Text>
          </TouchableOpacity>
        )}
      </Div>
      {varified && (
        <Text
          fontSize="md"
          lineHeight={20}
          color="#2F6E20"
          fontFamily={fontHauoraMedium}
          mt={4}
        >
          Verified
        </Text>
      )}
    </React.Fragment>
  );
};

export default SettingPersonalInfoScreen;
