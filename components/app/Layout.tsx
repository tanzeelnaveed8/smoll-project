import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Div } from "react-native-magnus";

const Layout: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ children, style }) => {
  const externalStyles: {} = style ? style : {};
  return (
    <Div style={{ ...styles.container, ...externalStyles }}>{children}</Div>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    // paddingTop: 20,
  },
});
