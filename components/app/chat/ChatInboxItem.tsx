import React from "react";
import { Button, Div, Image, Text } from "react-native-magnus";
import { IconChevronRight } from "@tabler/icons-react-native";
import { TouchableOpacity } from "react-native";

interface Props {
  onPress: () => void;
  title: string;
  subtitle: string;
  image: string;
}

const ChatInboxItem: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Button
        bg="transparent"
        p={0}
        flexDir={"row"}
        alignItems="center"
        pb={20}
        style={{ gap: 24 }}
        pointerEvents="none"
      >
        <Image w={72} h={72} rounded={100} source={{ uri: props.image }} />

        <Div flexDir="row" alignItems="center" flex={1}>
          <Div>
            <Text fontSize={"xl"} mb={4} lineHeight={24}>
              {props.title}
            </Text>
            <Text mb={4} fontSize={"md"} color="darkGreyText">
              {props.subtitle}
            </Text>
          </Div>

          <Div ml="auto">
            <IconChevronRight width={24} height={24} color={"#222222"} />
          </Div>
        </Div>
      </Button>

      <Div style={{ borderBottomColor: "#E0E0E0", borderBottomWidth: 1 }}></Div>
    </TouchableOpacity>
  );
};

export default ChatInboxItem;
