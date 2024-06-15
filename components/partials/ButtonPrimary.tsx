import { fontHauora } from "@/constant/constant";
import React from "react";
import { ButtonProps } from "react-native";
import { Button } from "react-native-magnus";

const ButtonPrimary: React.FC<{
  children: string;
  bgColor?: "dark" | "primary";
}> = ({ children, bgColor = "dark" }) => {
  return (
    <Button
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
