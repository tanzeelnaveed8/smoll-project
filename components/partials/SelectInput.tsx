import { fontHauora } from "@/constant/constant";
import React, { RefObject, useState } from "react";
import { Button, Div, Select, SelectRef, Text } from "react-native-magnus";

const dummyOptions = [
  "option 1",
  "option 2",
  "option 3",
  "option 4",
  "option 5",
  "option 6",
];

const SelectInput: React.FC<{
  options?: string[];
  label?: string;
  marginBottom?: number;
}> = ({ options = dummyOptions, label, marginBottom }) => {
  const [selectValue, setSelectedValue] = useState<string>("");
  const selectRef = React.createRef<SelectRef>();
  return (
    <Div>
      {/* <Button
        // flex={1}
        block
        borderWidth={1}
        bg="white"
        color="red"
        borderColor="#222222"
        onPress={() => {
          if (selectRef.current) {
            selectRef.current.open();
          }
        }}
      >
        {selectValue ? selectValue.toString() : "Select"}
      </Button> */}

      <Button
        py={16}
        px={12}
        fontSize={18}
        fontFamily={fontHauora}
        rounded={12}
        borderColor="#494949"
        borderWidth={1}
        mb={marginBottom ? marginBottom : 0}
        ripple
        bg="transparent"
        color="#494949"
        style={{ width: "100%", justifyContent: "flex-start" }}
        onPress={() => {
          if (selectRef.current) {
            selectRef.current.open();
          }
        }}
      >
        {selectValue ? selectValue.toString() : label ? label : "Select"}
      </Button>

      <Select
        onSelect={(e) => {
          setSelectedValue(e);
        }}
        ref={selectRef}
        value={selectValue}
        title={label ? label : "Select Your City"}
        mt="md"
        pb="2xl"
        roundedTop="xl"
        data={options}
        renderItem={(item, index) => (
          <Select.Option value={item} py="md" px="xl">
            <Text>{item}</Text>
          </Select.Option>
        )}
      />
    </Div>
  );
};

export default SelectInput;
