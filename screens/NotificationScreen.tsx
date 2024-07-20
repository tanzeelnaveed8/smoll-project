import Layout from "@/components/app/Layout";
import {
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { IconAlertCircle, IconVideo } from "@tabler/icons-react-native";
import React from "react";
import { FlatList } from "react-native";
import { Div, ScrollDiv, Text } from "react-native-magnus";

const notificationList = [
  {
    icon: (w: number) => <IconVideo width={w} height={w} color={"#222222"} />,
    title: "Video Consultation Confirmed",
    text: "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    receivedTime: "2024-07-20T06:07:44.124Z",
  },
  {
    icon: (w: number) => (
      <IconAlertCircle width={w} height={w} color={"#222222"} />
    ),
    title: "Appointment Cancelled",
    text: "Your appointment on 01 July 2024 at 11:25 has been canceled. ",
    receivedTime: "2024-07-20T06:02:44.124Z",
    type: "error",
  },
];

const NotificationScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  return (
    <Layout
      title="Notification"
      showBack
      backBtnText=""
      style={{ justifyContent: "flex-start" }}
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      {true && (
        <ScrollDiv showsVerticalScrollIndicator={false} pt={16}>
          <Div>
            <Text fontSize={"lg"} fontFamily={fontHauoraBold} mb={24}>
              Recent
            </Text>

            <Div>
              {notificationList.map((item, i) => {
                return (
                  <Div
                    key={i}
                    flexDir="row"
                    style={{ gap: 20 }}
                    pb={20}
                    mb={20}
                    borderBottomWidth={1}
                    borderBottomColor={
                      i + 1 === notificationList.length
                        ? "transparent"
                        : "#D0D7DC"
                    }
                  >
                    <Div
                      w={40}
                      h={40}
                      rounded={40}
                      bg="#EFEFEF"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {item.icon(24)}
                    </Div>

                    <Div>
                      <Text
                        fontSize={"lg"}
                        fontFamily={fontHauoraBold}
                        mb={2}
                        color={item.type === "error" ? "#E02A2A" : ""}
                      >
                        {item.title}
                      </Text>

                      <Text
                        fontSize={"lg"}
                        fontFamily={fontHauoraMedium}
                        color="darkGreyText"
                        mb={8}
                        w={290}
                      >
                        {item.text}
                      </Text>

                      <Text
                        fontSize={"md"}
                        fontFamily={fontHauoraMedium}
                        color="#7B7B7B"
                      >
                        01 hours ago
                      </Text>
                    </Div>
                  </Div>
                );
              })}
            </Div>
          </Div>
        </ScrollDiv>
      )}
      {!true && (
        <Div h={"85%"} justifyContent="center" alignItems="center">
          <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
            No Notification found
          </Text>
        </Div>
      )}
    </Layout>
  );
};

export default NotificationScreen;
