import { fontHauora } from "@/constant/constant";
import React, { useRef, useState } from "react";
import { Animated, StyleProp, StyleSheet, TextStyle } from "react-native";
import { Button, Div, Icon, Input, Text } from "react-native-magnus";
import { iconFontFamilyType } from "react-native-magnus/lib/typescript/src/ui/icon/icon.type";

const InputField: React.FC<{
  icon?: string;
  iconFamily?: iconFontFamilyType;
  placeholder: string;
  marginBottom?: number;
  floatingPlaceholder?: boolean;
  borderRadius?: number;
  inputStyle?: StyleProp<TextStyle>;
}> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const { floatingPlaceholder } = props;

  const topPosition = useRef(new Animated.Value(16)).current; // Initial top position

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
    <Div style={styles.container}>
      {floatingPlaceholder && (
        <Animated.Text
          // fontSize={isFocused ? 16 : 18}
          style={{
            ...styles.floatingLabel,
            fontSize: isFocused ? 12 : 18,
            top: topPosition, // Use Animated.Value for the top style
            color: "#494949",
          }}
        >
          {props.placeholder}
        </Animated.Text>
      )}

      <Input
        style={{
          borderRadius: props.borderRadius ? props.borderRadius : 8,
          ...externalStyles,
        }}
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
        // focusBorderColor="#222222"
        focusBorderColor="#427594"
        borderColor="#494949"
        onFocus={handleFocus}
        onBlur={handleBlur}
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
    left: 12,
    pointerEvents: "none",
  },
});
