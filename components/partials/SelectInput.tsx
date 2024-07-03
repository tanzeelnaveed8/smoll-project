import { fontHauora } from "@/constant/constant";
import React, { RefObject, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import {
  Button,
  Div,
  Icon,
  Select,
  SelectRef,
  Text,
} from "react-native-magnus";
import BottomSheet from "./BottomSheet";

const dummyOptions = [
  { label: "option 1", value: "option 1" },
  { label: "option 2", value: "option 2" },
  { label: "option 3", value: "option 3" },
];

const SelectInput: React.FC<{
  options?: { label: string; value: string }[];
  label?: string;
  marginBottom?: number;
  selectStyles?: StyleProp<ViewStyle>;
  borderWidth?: number;
  borderBottom?: number;
  borderColor?: string;
  paddingX?: number;
  paddingY?: number;
  borderRadius?: number;
}> = ({
  options = dummyOptions,
  label,
  marginBottom,
  selectStyles,
  borderBottom,
  borderWidth,
  borderColor,
  paddingX,
  paddingY,
  borderRadius,
}) => {
  const [selectValue, setSelectedValue] = useState<string>("");
  const selectRef = React.createRef<SelectRef>();

  const externalStyles: {} = selectStyles || {};

  return (
    <BottomSheet isVisible showCloseIcon title={label}>
      <Text>Test</Text>
      {/* <Button
        py={typeof paddingY === "number" ? paddingY : 16}
        px={typeof paddingX === "number" ? paddingX : 12}
        fontSize={18}
        fontFamily={fontHauora}
        rounded={typeof borderRadius === "number" ? borderRadius : 12}
        borderColor={borderColor ? borderColor : "#494949"}
        borderWidth={borderWidth === undefined ? 1 : borderWidth}
        borderBottomWidth={borderBottom === undefined ? 1 : borderBottom}
        mb={marginBottom ? marginBottom : 0}
        ripple
        bg="transparent"
        color="#494949"
        style={{
          width: "100%",
          justifyContent: "space-between",
          ...externalStyles,
        }}
        onPress={() => {
          if (selectRef.current) {
            selectRef.current.open();
          }
        }}
      >
        <Text fontSize={"xl"}>
          {selectValue ? selectValue.toString() : label ? label : "Select"}
        </Text>
        <Icon
          fontSize={24}
          color="#222222"
          name="keyboard-arrow-down"
          fontFamily="MaterialIcons"
        />
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
          <Select.Option value={item} py="md" px={5}>
            <Text>{item}</Text>
          </Select.Option>
        )}
      /> */}
    </BottomSheet>
  );
};

export default SelectInput;
