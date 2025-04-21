import { fontHauora, fontHauoraMedium } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React from "react";
import { Button, ButtonProps, Text } from "react-native-magnus";

interface ButtonPrimaryProps extends ButtonProps {
  onTouchEnd?: () => void;
  children: string | React.ReactNode;
  bgColor?: "dark" | "primary" | "danger";
  link?: string;
  params?: { [key: string]: string };
  navigation?: NavigationType;
  icon?: React.ReactNode;
  textColor?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  children,
  bgColor = "dark",
  onTouchEnd,
  link,
  navigation,
  params = {},
  icon,
  textColor,
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
      bg={bgColor === "dark" ? "#222222" : bgColor === "danger" ? "#E02A2A" : "#427594"}
      rounded="circle"
      ripple
      style={{ width: "100%", columnGap: 10 }}
      {...restProps}
    >
      {icon && icon}
      <Text color={textColor ?? "white"} mb={2} fontSize={"xl"} fontFamily={fontHauoraMedium}>
        {children}
      </Text>
    </Button>
  );
};

export default ButtonPrimary;
