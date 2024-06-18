import CountryDropdown from "@/components/app/CountryDropdown";
import InputField from "@/components/partials/InputField";
import SelectInput from "@/components/partials/SelectInput";
import React from "react";
import { Div, Text } from "react-native-magnus";

const ProfileAddressScreen = () => {
  return (
    <Div>
      <Text fontSize={"4xl"} mb={4}>
        What’s your address?
      </Text>
      <Text fontSize={"xl"} mb={20}>
        We will use your address for pharmacy fulfillments.
      </Text>

      <Div style={{ gap: 16 }}>
        <InputField
          placeholder="Flat/Villa No"
          inputStyle={{
            borderRadius: 12,
          }}
        />
        <InputField
          placeholder="Street address"
          inputStyle={{
            borderRadius: 12,
          }}
        />

        <SelectInput />
        <CountryDropdown />

        <InputField
          placeholder="Postal code"
          inputStyle={{
            borderRadius: 12,
          }}
        />
      </Div>
    </Div>
  );
};

export default ProfileAddressScreen;
