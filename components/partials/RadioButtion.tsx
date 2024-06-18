import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Button, Div, Text } from "react-native-magnus";

const RadioButtion: React.FC<{
  onTab: () => void;
  selectedValue: string;
  value: string;
  styles?: StyleProp<ViewStyle>;
}> = ({ onTab, value, selectedValue, styles: externalStyling }) => {
  const externalStyles: {} = externalStyling ? externalStyling : {};

  return (
    <Button
      bg="transparent"
      py={0}
      px={0}
      style={{
        ...styles.radio,
        ...externalStyles,
      }}
      onTouchEnd={onTab}
    >
      <Text fontSize={"xl"}>{value}</Text>
      <Div
        style={{
          ...styles.radioCircle,
        }}
      >
        {value === selectedValue ? (
          <Div style={styles.activeRadioCircle} />
        ) : (
          ""
        )}
      </Div>
    </Button>
  );
};

export default RadioButtion;

const styles = StyleSheet.create({
  radio: {
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#494949",
    justifyContent: "center",
    alignItems: "center",
  },
  activeRadioCircle: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: "#427594",
  },
});
