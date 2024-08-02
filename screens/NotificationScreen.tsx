import Layout from "@/components/app/Layout";
import {
  colorPrimary,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useNotificationStore } from "@/store/modules/notification";
import { NavigationType } from "@/store/types";
import {
  NotificationDto,
  NotificationListDto,
} from "@/store/types/notification";
import { IconAlertCircle, IconVideo } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList } from "react-native";
import { Div, ScrollDiv, Text } from "react-native-magnus";
import NotificationTestScreen from "./NotificationTestScreen";

const dummyNotificationList = [
  {
    id: 0,
    message:
      "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:02:44.124Z",
  },
  {
    id: 0,
    message: "Your appointment on 01 July 2024 at 11:25 has been canceled.",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:07:44.124Z",
  },
  {
    id: 0,
    message:
      "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:02:44.124Z",
  },
  {
    id: 0,
    message: "Your appointment on 01 July 2024 at 11:25 has been canceled.",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:07:44.124Z",
  },
  {
    id: 0,
    message:
      "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:02:44.124Z",
  },
  {
    id: 0,
    message: "Your appointment on 01 July 2024 at 11:25 has been canceled.",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:07:44.124Z",
  },
  {
    id: 0,
    message:
      "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:02:44.124Z",
  },
  {
    id: 0,
    message: "Your appointment on 01 July 2024 at 11:25 has been canceled.",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:07:44.124Z",
  },
  {
    id: 0,
    message:
      "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:02:44.124Z",
  },
  {
    id: 0,
    message: "Your appointment on 01 July 2024 at 11:25 has been canceled.",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:07:44.124Z",
  },
  {
    id: 0,
    message:
      "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:02:44.124Z",
  },
  {
    id: 0,
    message: "Your appointment on 01 July 2024 at 11:25 has been canceled.",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:07:44.124Z",
  },
  {
    id: 0,
    message:
      "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:02:44.124Z",
  },
  {
    id: 0,
    message: "Your appointment on 01 July 2024 at 11:25 has been canceled.",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:07:44.124Z",
  },
  {
    id: 0,
    message:
      "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:02:44.124Z",
  },
  {
    id: 0,
    message: "Your appointment on 01 July 2024 at 11:25 has been canceled.",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:07:44.124Z",
  },
  {
    id: 0,
    message:
      "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:02:44.124Z",
  },
  {
    id: 0,
    message: "Your appointment on 01 July 2024 at 11:25 has been canceled.",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:07:44.124Z",
  },
  {
    id: 0,
    message:
      "Your appointment is confirmed for 01 July 2024 at 11:25 with Dr. Abbas Sheikh",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:02:44.124Z",
  },
  {
    id: 0,
    message: "Your appointment on 01 July 2024 at 11:25 has been canceled.",
    isRead: true,
    meta: {},
    createdAt: "2024-07-20T06:07:44.124Z",
  },
];

const NotificationScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { fetchNotifications } = useNotificationStore();
  const [loading, setLoading] = useState(false);

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

            <NotificationTestScreen navigation={navigation} />
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
