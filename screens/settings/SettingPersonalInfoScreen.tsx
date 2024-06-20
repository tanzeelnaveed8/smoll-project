import React from "react";
import { Div, Icon, Text } from "react-native-magnus";
import { fontHauora } from "@/constant/constant";
import SettingBackButton from "@/components/settings/SettingBackButton";

const SettingPersonalInfoScreen = () => {
  return (
    <Div pt={20}>
      <Div mb={24}>
        <SettingBackButton text="Settings" />

        <Text
          fontSize={"5xl"}
          fontWeight="400"
          lineHeight={36}
          fontFamily={fontHauora}
          textTransform="capitalize"
        >
          Personal Info
        </Text>
      </Div>

      <Div
        w={96}
        h={96}
        rounded={100}
        bg="#EFEFEF"
        justifyContent="flex-end"
        pb={20}
        position="relative"
      >
        <Icon name="user" fontSize={52} fontFamily="Feather" color="#222222" />

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
          <Icon
            name="circle-edit-outline"
            fontSize={22}
            fontFamily="MaterialCommunityIcons"
            color="#222222"
          />
        </Div>
      </Div>

      <Div mt={24}>
        <Option title="First Name" value="Fahad" />
        <Option title="Second name" value="Khan" />
        <Option title="Email address" value="fahad92@gmail.com" varified />
        <Option title="Phone number" value="(+971) 82 474 7493" varified />
      </Div>
    </Div>
  );
};

type OptionPropTypes = {
  title: string;
  value: string;
  varified?: boolean;
};
const Option = (props: OptionPropTypes) => {
  const { title, value, varified } = props;
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
          <Text color="#494949" fontSize="sm" lineHeight={16}>
            {title}
          </Text>
          <Text color="#222222" fontSize={18} lineHeight={24}>
            {value}
          </Text>
        </Div>

        <Text fontSize={16} lineHeight={24} color="#0189F9">
          Edit
        </Text>
      </Div>
      {varified && (
        <Text fontSize="md" lineHeight={20} color="#2F6E20" mt={4}>
          Verified
        </Text>
      )}
    </React.Fragment>
  );
};

export default SettingPersonalInfoScreen;
