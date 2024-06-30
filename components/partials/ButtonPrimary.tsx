import { fontHauora } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React from "react";
import { Button, ButtonProps } from "react-native-magnus";

interface ButtonPrimaryProps extends ButtonProps {
  onTouchEnd?: () => void;
  children: string;
  bgColor?: "dark" | "primary";
  link?: string;
  params?: { [key: string]: string };
  navigation?: NavigationType;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  children,
  bgColor = "dark",
  onTouchEnd,
  link,
  navigation,
  params = {},
  ...restProps
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
      ripple
      style={{ width: "100%" }}
      {...restProps}
    >
      {children}
    </Button>
  );
};

export default ButtonPrimary;
