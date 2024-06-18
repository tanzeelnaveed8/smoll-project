import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View } from "react-native-animatable";

import { CountryPicker } from "react-native-country-codes-picker";
import { Text } from "react-native-magnus";

const CountryDropdown = () => {
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");

  return (
    <View style={{}}>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          borderColor: "#494949",
          borderWidth: 1,
          paddingHorizontal: 12,
          paddingVertical: 16,
          borderRadius: 12,
        }}
      >
        <Text
          style={{
            color: "#494949",
            fontSize: 20,
          }}
        >
          {countryCode ? countryCode : "Select your Country"}
        </Text>
      </TouchableOpacity>
      {/* // For showing picker just put show state to show prop */}
      <CountryPicker
        lang="en"
        show={show}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={(item) => {
          console.log("item", item);
          setCountryCode(`${item.flag} ${item.name.en}`);
          setShow(false);
        }}
      />
    </View>
  );
};

export default CountryDropdown;
