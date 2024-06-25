import React, { useState } from "react";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";
import { View } from "react-native-animatable";

import { CountryPicker } from "react-native-country-codes-picker";
import { Text } from "react-native-magnus";

const CountryDropdown: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  style,
}) => {
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const externalStyles: {} = style ? style : {};

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          borderColor: "#494949",
          borderWidth: 1,
          paddingHorizontal: 12,
          paddingVertical: 16,
          borderRadius: 12,
          ...externalStyles,
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
          setCountryCode(`${item.flag} (${item.dial_code}) ${item.name.en}`);
          setShow(false);
        }}
      />
    </View>
  );
};

export default CountryDropdown;
