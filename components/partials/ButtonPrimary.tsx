import { fontHauora } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React from "react";
import { ButtonProps } from "react-native";
import { Button } from "react-native-magnus";

const ButtonPrimary: React.FC<{
  onTouchEnd?: () => void;

  children: string;
  bgColor?: "dark" | "primary";
  link?: string;
  params?: { [key: string]: string };
  navigation?: NavigationType;
}> = ({
  children,
  bgColor = "dark",
  onTouchEnd,
  link,
  navigation,
  params = {},
}) => {
  return (
    <Button
      onTouchEnd={() => {
        if (onTouchEnd) onTouchEnd();
        if (link && navigation) {
          navigation.navigate(link, { ...params });
        }
      }}
      py={16}
      bg={bgColor === "dark" ? "#222222" : "#427594"}
      fontSize={18}
      fontFamily={fontHauora}
      rounded="circle"
      color="white"
      // shadow={2}
      ripple
      style={{ width: "100%" }}
    >
      {children}
    </Button>
  );
};

export default ButtonPrimary;
