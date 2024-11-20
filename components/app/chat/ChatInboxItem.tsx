import React from "react";
import { Button, Div, Image, Text } from "react-native-magnus";
import { IconChevronRight } from "@tabler/icons-react-native";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { colorPrimary } from "@/constant/constant";

interface Props {
  onPress: () => void;
  title: string;
  subtitle: string;
  image: string;
  loading?: string;
  expertId: string;
}

const ChatInboxItem: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      disabled={props.loading ? true : false}
      onPress={props.onPress}
    >
      <Button
        bg="transparent"
        p={0}
        flexDir={"row"}
        alignItems="center"
        py={15}
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
            {props.loading === props.expertId ? (
              <ActivityIndicator size="small" color={colorPrimary} />
            ) : (
              <IconChevronRight width={24} height={24} color={"#222222"} />
            )}
          </Div>
        </Div>
      </Button>

      <Div style={{ borderBottomColor: "#E0E0E0", borderBottomWidth: 1 }}></Div>
    </TouchableOpacity>
  );
};

export default ChatInboxItem;
