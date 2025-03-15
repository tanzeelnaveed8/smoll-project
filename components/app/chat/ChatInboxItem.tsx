import React, { useEffect, useState } from "react";
import { Button, Div, Image, Text } from "react-native-magnus";
import { IconChevronRight } from "@tabler/icons-react-native";
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
  unreadMessageCount?:number
}

const ChatInboxItem: React.FC<Props> = (props) => {
  const [showNotification , setShowNotification] = useState(true)
  const {unreadMessages} = useExpertStore() 
  
  const handlePress = () =>{
    setShowNotification(false)
    props.onPress()
  }
  
  useEffect(()=>{
    setShowNotification(true)
  },[unreadMessages.size])

  return (
    <TouchableOpacity
      disabled={props.loading ? true : false}
      onPress={handlePress}
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

        <Div flexDir="row" alignItems="center" flex={1} position="relative">
          <Div>
            <Div row style={{ gap: 7 }} >
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
                {props.about.length > 60
                  ? props.about.slice(0, 60) + "..."
                  : props.about}
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

          {props.loading !== props.expertId && Boolean(props.unreadMessageCount) && !props.loading && showNotification && <Text h={24} w={24} style={{
                  backgroundColor: '#f52c11',
                  borderRadius: 100,
                  color:'#fff',
                  fontWeight:'600',
                  textAlign:'center',
                  position:'absolute',
                  top:1,
                  right:0
               }}>
                 {props.unreadMessageCount}
               </Text>
          }
        </Div>
      </Button>

      <Div style={{ borderBottomColor: "#E0E0E0", borderBottomWidth: 1 }}></Div>
    </TouchableOpacity>
  );
};

export default ChatInboxItem;
