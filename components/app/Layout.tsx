import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Div, Text } from "react-native-magnus";
import BackButton from "../partials/BackButton";
import { fontHauoraSemiBold } from "@/constant/constant";

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showBack?: boolean;
  onBackPress?: () => void;
  backBtnText?: string;
  title?: string;
}

const Layout: React.FC<Props> = ({
  children,
  style,
  onBackPress,
  showBack,
  backBtnText = "Back",
  title,
}) => {
  const externalStyles: {} = style ? style : {};
  return (
    <Div style={{ ...styles.container, ...externalStyles }}>
      <Div row style={styles.titleContainer}>
        <Div
          row
          justifyContent="space-between"
          alignItems="center"
          position="relative"
          flex={1}
          // bg="yellow"
        >
          {showBack && (
            <Div position="absolute" top={2}>
              <BackButton onPress={onBackPress} text={backBtnText} />
            </Div>
          )}
          {/* <Div flex={1} minH={34}> */}
          <Text
            fontSize={"xl"}
            fontWeight="600"
            textAlign="center"
            flex={1}
            lineHeight={28}
            fontFamily={fontHauoraSemiBold}
          >
            {title}
          </Text>
          {/* </Div> */}
          {/* <Div flex={1} /> */}
        </Div>
      </Div>
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
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    lineHeight: 21,
  },
});
