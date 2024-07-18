import { fontHauoraSemiBold } from "@/constant/constant";
import { IconSquareRoundedPlus } from "@tabler/icons-react-native";
import React from "react";
import { Button, Text } from "react-native-magnus";

const AddButton: React.FC<{ text: string; onPress?: () => void }> = ({
  text,
  onPress,
}) => {
  return (
    <Button
      fontSize={"lg"}
      fontFamily={fontHauoraSemiBold}
      color="primary"
      flexDir="row"
      alignItems="flex-start"
      style={{ gap: 4 }}
      p={0}
      bg="transparent"
      onPress={onPress}
    >
      <IconSquareRoundedPlus
        width={24}
        height={24}
        color={"#427594"}
        style={{ marginTop: 2 }}
      />
      <Text color="primary" fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
        {text}
      </Text>
    </Button>
  );
};

export default AddButton;
