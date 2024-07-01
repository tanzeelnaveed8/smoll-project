import { fontHauora } from "@/constant/constant";
import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  TextStyle,
} from "react-native";
import { Button, Div, Icon, Input, Text } from "react-native-magnus";
import { iconFontFamilyType } from "react-native-magnus/lib/typescript/src/ui/icon/icon.type";

const InputField: React.FC<{
  icon?: string;
  iconColor?: string;
  borderColor?: string;
  iconFamily?: iconFontFamilyType;
  placeholder: string;
  marginBottom?: number;
  marginTop?: number;
  floatingPlaceholder?: boolean;
  borderRadius?: number;
  inputStyle?: StyleProp<TextStyle>;
  multiline?: boolean;
  numberOfLines?: number;
  paddingX?: number;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  onChangeText?: (text: string) => void;
  value: string;
}> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const { floatingPlaceholder, onChangeText, value } = props;

  const topPosition = useRef(new Animated.Value(18)).current; // Initial top position

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(topPosition, {
      toValue: 8, // New top position when focused
      duration: 300, // Animation duration in ms
      useNativeDriver: false, // Set to true if only transforming (translateX, translateY)
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(topPosition, {
      toValue: 16, // Reset top position when not focused
      duration: 200, // Animation duration in ms
      useNativeDriver: false, // Set to true if only transforming (translateX, translateY)
    }).start();
  };

  const externalStyles: {} = props.inputStyle || {};

  return (
    <Div
      style={{
        ...styles.container,
        pointerEvents: props.disabled ? "none" : "auto",
      }}
      mb={props.marginBottom ? props.marginBottom : 0}
      mt={props.marginTop ? props.marginTop : 0}
    >
      {floatingPlaceholder && (
        <Animated.Text
          // fontSize={isFocused ? 16 : 18}
          style={{
            ...styles.floatingLabel,
            fontSize: isFocused ? 12 : 18,
            top: topPosition, // Use Animated.Value for the top style
            color: "#494949",
            left: typeof props.paddingX === "number" ? props.paddingX : 12,
          }}
        >
          {props.placeholder}
        </Animated.Text>
      )}

      <Input
        style={{
          borderRadius: 12,
          ...externalStyles,
        }}
        placeholder={floatingPlaceholder ? "" : props.placeholder}
        fontFamily={fontHauora}
        textAlignVertical="top"
        placeholderTextColor={"#494949"}
        bg="transparent"
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        keyboardType={props.keyboardType}
        color="#494949"
        fontSize={"xl"}
        px={typeof props.paddingX === "number" ? props.paddingX : 12}
        pr={props.icon ? 30 : 12}
        // py={floatingPlaceholder ? 0 : 16}
        pt={floatingPlaceholder ? 24 : 16}
        pb={floatingPlaceholder ? 8 : 16}
        // focusBorderColor="#222222"
        focusBorderColor="#427594"
        borderColor={props.borderColor ? props.borderColor : "#222222"}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={onChangeText}
        value={value}
        // suffix={
        //   props.icon ? (
        //     <Button py={0} px={0} bg={"transparent"} ripple>
        //       <Icon
        //         name={props.icon}
        //         color={props.iconColor || "gray900"}
        //         fontFamily={props.iconFamily ? props.iconFamily : "Ionicons"}
        //         fontSize={24}
        //       />
        //     </Button>
        //   ) : (
        //     ""
        //   )
        // }
      />

      {props.icon && (
        <Button
          py={0}
          px={0}
          bg={"transparent"}
          position="absolute"
          top={20}
          right={typeof props.paddingX === "number" ? props.paddingX : 12}
          ripple
        >
          <Icon
            name={props.icon}
            color={props.iconColor || "gray900"}
            fontFamily={props.iconFamily ? props.iconFamily : "Ionicons"}
            fontSize={24}
          />
        </Button>
      )}
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
    // left: 12,
    pointerEvents: "none",
  },
  iconBtn: {
    // top: 0,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 50,
    pointerEvents: "none",
    backgroundColor: "red",
    // width: 50,
    // height: 50,
  },
});
