import {
  colorDisableBg,
  colorDisableBorder,
  colorDisableText,
  colorTextPrimary,
  fontHauora,
} from "@/constant/constant";
import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Animated,
  KeyboardTypeOptions,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
} from "react-native";
import {
  Button,
  Div,
  Icon,
  Image,
  Input,
  InputProps,
} from "react-native-magnus";
import { iconFontFamilyType } from "react-native-magnus/lib/typescript/src/ui/icon/icon.type";
import { Keyboard } from "react-native";

interface rest {
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
  paddingX?: number;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  onChangeText?: (text: string) => void;
  value?: string;
  focus?: boolean;
  countryFlag?: string;
}

interface InputFieldProps extends Omit<rest, keyof InputProps>, InputProps {
  ref?: React.Ref<any>;
}

const InputField = forwardRef<any, InputFieldProps>(
  (
    { marginBottom, marginTop, borderRadius, multiline, countryFlag, ...rest },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const { floatingPlaceholder, onChangeText, value } = rest;
    const [valueExist, setValueExist] = useState(value ? true : false);
    const inputRef = useRef<any>(null);

    const topPosition = useRef(new Animated.Value(value ? 4 : 18)).current; // Initial top position

    useEffect(() => {
      if (value) {
        setValueExist(true);
      }
    }, [value]);

    const handleFocus = () => {
      setIsFocused(true);
      Animated.timing(topPosition, {
        toValue: 4, // New top position when focused
        duration: 300, // Animation duration in ms
        useNativeDriver: false, // Set to true if only transforming (translateX, translateY)
      }).start();
    };

    const handleBlur = (e: any) => {
      // console.log(
      //   "handleBlur",
      //   e.target?._internalFiberInstanceHandleDEV?.elementType
      // );

      setIsFocused(false);
      // Keyboard.dismiss();

      if (valueExist) return;
      Animated.timing(topPosition, {
        toValue: 16, // Reset top position when not focused
        duration: 200, // Animation duration in ms
        useNativeDriver: false, // Set to true if only transforming (translateX, translateY)
      }).start();
    };

    const externalStyles: {} = rest.inputStyle || {};

    useEffect(() => {
      if (rest.focus) {
        inputRef.current?.focus();
      }
    }, [rest.focus]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
    }));

    return (
      <Div
        style={{
          ...styles.container,
          pointerEvents: rest.disabled ? "none" : "auto",
        }}
        mb={marginBottom ? marginBottom : 0}
        mt={marginTop ? marginTop : 0}
      >
        {floatingPlaceholder && (
          <Animated.Text
            // fontSize={isFocused ? 16 : 18}
            style={{
              ...styles.floatingLabel,
              fontSize: isFocused || valueExist ? 12 : 18,
              top: topPosition, // Use Animated.Value for the top style
              color: "#494949",
              left: typeof rest.paddingX === "number" ? rest.paddingX : 12,
              pointerEvents: "none",
            }}
          >
            {rest.placeholder}
          </Animated.Text>
        )}

        {countryFlag && (
          <Image
            w={30}
            h={22}
            src={countryFlag}
            position="absolute"
            top={18}
            left={10}
          />
        )}

        <Input
          {...rest}
          style={{
            borderRadius: borderRadius ?? 12,
            ...externalStyles,
          }}
          ref={inputRef}
          focusable
          placeholder={floatingPlaceholder ? "" : rest.placeholder}
          fontFamily={fontHauora}
          placeholderTextColor={colorTextPrimary}
          bg={
            rest.disabled ? colorDisableBg : rest.bg ? rest.bg : "transparent"
          }
          color={rest.disabled ? colorDisableText : colorTextPrimary}
          fontSize={"xl"}
          h={rest.h ? rest.h : multiline ? "unset" : 56}
          loaderColor={colorTextPrimary}
          pl={countryFlag ? 45 : 12}
          // px={typeof rest.paddingX === "number" ? rest.paddingX : 12}
          // pr={rest.icon ? 30 : 12}
          // pt={16}
          // pb={floatingPlaceholder ? 8 : 16}
          focusBorderColor="#427594"
          borderColor={
            rest.disabled
              ? colorDisableBorder
              : rest.borderColor
              ? rest.borderColor
              : "#222222"
          }
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={(e) => {
            if (onChangeText) {
              onChangeText(e);
            }

            if (e.length > 0) {
              setValueExist(true);
            } else {
              setValueExist(false);
            }
          }}
          value={value}
        />
      </Div>
    );
  }
);

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
