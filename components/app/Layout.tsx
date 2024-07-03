import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Div } from "react-native-magnus";
import BackButton from "../partials/BackButton";

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showBack?: boolean;
  onBackPress?: () => void;
}

const Layout: React.FC<Props> = ({
  children,
  style,
  onBackPress,
  showBack,
}) => {
  const externalStyles: {} = style ? style : {};
  return (
    <Div style={{ ...styles.container, ...externalStyles }}>
      {showBack && <BackButton onPress={onBackPress} mb={20} />}
      {children}
    </Div>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingBottom: 20,
    // paddingTop: StatusBar.currentHeight,
    // paddingTop: 20,
  },
});
