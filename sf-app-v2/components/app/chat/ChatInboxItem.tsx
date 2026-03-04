import React, { useEffect, useState } from "react";
import { Avatar, Badge, Button, Div, Image, Tag, Text } from "react-native-magnus";
import { IconChevronRight, IconUser } from "@tabler/icons-react-native";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { colorPrimary, fontHauoraMedium } from "@/constant/constant";
import VerifiedIcon from "@/components/icons/VerifiedIcon";
import { useExpertStore } from "@/store/modules/expert";

interface Props {
  onPress: () => void;
  title: string;
  subtitle: string;
  image: string;
  loading?: string;
  expertId: string;
  verified?: boolean;
  about?: string;
  unreadMessageCount?: number;
  isOnline?: boolean;
}

const ChatInboxItem: React.FC<Props> = (props) => {
  const [showNotification, setShowNotification] = useState(true);
  const { unreadMessages } = useExpertStore();

  const handlePress = () => {
    setShowNotification(false);
    props.onPress();
  };

  useEffect(() => {
    setShowNotification(true);
  }, [unreadMessages.size]);

  return (
    <TouchableOpacity disabled={props.loading ? true : false} onPress={handlePress}>
      <Button
        bg="transparent"
        p={0}
        flexDir={"row"}
        alignItems="center"
        py={15}
        style={{ gap: 24 }}
        pointerEvents="none"
      >
        {/* <Image w={72} h={72} rounded={100} source={{ uri: props.image }} /> */}
        {props.isOnline ? (
          <Div mr={24}>
            <Badge
              right={4}
              top={1}
              h={15}
              w={15}
              style={{ backgroundColor: "#00ff28" }}
              borderWidth={2}
              borderColor="#fff"
            >
              {props.image ? (
                <Image source={{ uri: props.image }} w={72} h={72} rounded={100} bg="#eeeeee" />
              ) : (
                <IconUser size={24} />
              )}
            </Badge>
          </Div>
        ) : props.image ? (
          <Image source={{ uri: props.image }} w={72} h={72} rounded={100} bg="#eeeeee" mr={24} />
        ) : (
          <Avatar size={72} bg="#eeeeee" mr={24}>
            <IconUser size={30} color="#666" />
          </Avatar>
        )}

        <Div flexDir="row" alignItems="center" flex={1} position="relative">
          <Div>
            <Div row style={{ gap: 7 }}>
              <Text fontSize={"xl"} mb={4} lineHeight={24}>
                {props.title}
              </Text>
              {true && (
                <Div mt={4}>
                  <VerifiedIcon />
                </Div>
              )}
            </Div>
            <Text mb={4} fontSize={"md"} color="darkGreyText">
              {props.subtitle}
            </Text>

            {props.about && (
              <Text
                fontSize="md"
                // fontFamily={fontHauoraMedium}
                color="darkGreyText"
                lineHeight={20}
                maxW={"90%"}
              >
                {props.about.length > 60 ? props.about.slice(0, 60) + "..." : props.about}
              </Text>
            )}
          </Div>

          <Div ml="auto">
            {props.loading === props.expertId ? (
              <ActivityIndicator size="small" color={colorPrimary} />
            ) : (
              <>
                <IconChevronRight width={24} height={24} color={"#222222"} />
              </>
            )}
          </Div>

          {props.loading !== props.expertId &&
            Boolean(props.unreadMessageCount) &&
            !props.loading &&
            showNotification && (
              <Div
                h={24}
                w={24}
                bg={"#f52c11"}
                rounded={100}
                position="absolute"
                top={1}
                right={0}
                justifyContent="center"
                alignItems="center"
              >
                <Text color="#fff" fontWeight={"600"}>
                  {props.unreadMessageCount}
                </Text>
              </Div>
            )}
        </Div>
      </Button>

      <Div style={{ borderBottomColor: "#E0E0E0", borderBottomWidth: 1 }}></Div>
    </TouchableOpacity>
  );
};

export default ChatInboxItem;
