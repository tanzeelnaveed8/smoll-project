import { Div, Text } from "react-native-magnus";
import { fontHauora } from "@/constant/constant";
// import ButtonPrimary from "@/components/partials/ButtonPrimary";
// import InputField from "@/components/partials/InputField";
import SettingBackButton from "@/components/settings/SettingBackButton";

const SettingPersonalInfoScreen = () => {
  return (
    <Div pt={20}>
      <Div mb={32}>
        <SettingBackButton text="Settings" />

        <Text
          fontSize={"5xl"}
          fontWeight="400"
          lineHeight={36}
          fontFamily={fontHauora}
          mb={24}
          textTransform="capitalize"
        >
          Personal Info
        </Text>
      </Div>
    </Div>
  );
};

export default SettingPersonalInfoScreen;
