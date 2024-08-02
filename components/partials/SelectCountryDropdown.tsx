import React, { useEffect, useState } from "react";
import SelectInput from "./SelectInput";
import { GestureResponderEvent } from "react-native-modal";
import { TouchableOpacity } from "react-native";
import { Div, Text } from "react-native-magnus";
import { getCountryCodes } from "@/utils/country-codes";

const SelectCountryDropdown: React.FC<{
  showCountryFlag?: boolean;
  hideCountryCode?: boolean;
  onChange: (e: string) => void;
}> = ({ showCountryFlag, hideCountryCode, onChange }) => {
  const [country, setCountry] = useState<{
    label: string;
    value: string;
    flag: string;
  }>({
    label: "",
    value: "",
    flag: "",
  });
  const [codes, setCodes] = useState<
    { label: string; value: string; flag: string }[]
  >([]);

  console.log("country==", country);

  useEffect(() => {
    (async function () {
      const _codes = (await getCountryCodes()).map((c) => ({
        label: `${hideCountryCode ? "" : `${c.code}`} ${c.name}`,
        value: c.code,
        flag: c.flag,
      }));
      setCodes(_codes);
    })();
  }, []);

  return (
    <SelectInput
      label="Select a country"
      options={codes}
      onSelect={(val) => {
        setCountry(val);
        onChange(val.label);
      }}
      selectedValue={country}
      showCountryFlag={showCountryFlag}
      renderLabel={(options, onClick) => (
        <Country
          onPress={() => {
            console.log("options.flag", options.flag);
            onClick({
              value: options.value,
              label: options.label,
              flag: options.flag,
            });
          }}
          label={options.label}
          flag={options.flag}
        />
      )}
      //   mainInputStyle={{
      //     borderBottomRightRadius: 0,
      //     borderBottomLeftRadius: 0,
      //   }}
    />
  );
};

export default SelectCountryDropdown;

const Country: React.FC<{
  label: string;
  flag: string;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}> = ({ label, flag, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Div
        borderBottomWidth={0.75}
        borderColor="#DEDEDE"
        py={16}
        flexDir="row"
        alignItems="center"
        px={16}
      >
        <Div h={18} w={18} bgImg={{ uri: flag }} mr={16} />
        <Text fontSize="lg">{label}</Text>
      </Div>
    </TouchableOpacity>
  );
};
