import { fontHauora } from "@/constant/constant";
import React, { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Button, Div, Icon, Input, Text } from "react-native-magnus";
import { iconFontFamilyType } from "react-native-magnus/lib/typescript/src/ui/icon/icon.type";

const InputField: React.FC<{
  icon?: string;
  iconFamily?: iconFontFamilyType;
  placeholder: string;
  marginBottom?: number;
}> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const floatingPlaceholder = true;

  return (
    <Div style={styles.container}>
      <Text
        fontSize={isFocused ? "sm" : "xl"}
        style={{
          ...styles.floatingLabel,
          ...(isFocused ? styles.focusedFloatingLabel : {}),
        }}
      >
        {props.placeholder}
      </Text>

      <Input
        placeholder={floatingPlaceholder ? "" : props.placeholder}
        mb={props.marginBottom ? props.marginBottom : 0}
        fontFamily={fontHauora}
        placeholderTextColor={"#494949"}
        bg="transparent"
        color="#494949"
        fontSize={"xl"}
        px={12}
        // py={floatingPlaceholder ? 0 : 16}
        pt={floatingPlaceholder ? 24 : 16}
        pb={floatingPlaceholder ? 8 : 16}
        focusBorderColor="#222222"
        borderColor="#494949"
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        suffix={
          props.icon ? (
            <Button py={0} px={0} bg={"transparent"} ripple>
              <Icon
                name={props.icon}
                color="gray900"
                fontFamily={props.iconFamily ? props.iconFamily : "Ionicons"}
                fontSize={24}
              />
            </Button>
          ) : (
            ""
          )
        }
      />
    </Div>
  );
};

export default InputField;

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  floatingLabel: {
    position: "absolute",
    // zIndex: 10,
    left: 12,
    top: 16,
    pointerEvents: "none",
  },
  focusedFloatingLabel: {
    top: 8,
  },
});
