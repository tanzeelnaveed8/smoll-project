import Layout from "@/components/app/Layout";
import {
  colorPrimary,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useNotificationStore } from "@/store/modules/notification";
import { NavigationType } from "@/store/types";
import { NotificationDto } from "@/store/types/notification";
import { IconAlertCircle, IconVideo } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList } from "react-native";
import { Div, ScrollDiv, Text } from "react-native-magnus";

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
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState();
  const [notificationList, setNotificationList] =
    useState<NotificationDto | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      await fetchNotifications(page, 10);
      const dummyResponse: NotificationDto = {
        count: 0,
        totalCount: 0,
        totalPages: 10,
        currentPage: page,
        nextPage: page + 1,
        data: notificationList?.data?.length
          ? [...dummyNotificationList, ...notificationList.data]
          : [...dummyNotificationList],
      };

      setNotificationList(dummyResponse);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log("notifications", notifications);
  console.log("notificationList", notificationList);
  console.log("page", page);

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
              {/* {notificationList &&
                notificationList.data.map((item, i) => {
                  return (
                    <Div
                      key={i}
                      flexDir="row"
                      style={{ gap: 20 }}
                      pb={20}
                      mb={20}
                      borderBottomWidth={1}
                      borderBottomColor={
                        i + 1 === notificationList.data.length
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
                        <IconAlertCircle
                          width={24}
                          height={24}
                          color={"#222222"}
                        />
                      </Div>

                      <Div>
                        <Text>{i + 1}</Text>
                        <Text
                          fontSize={"lg"}
                          fontFamily={fontHauoraMedium}
                          color="darkGreyText"
                          mb={8}
                          w={290}
                        >
                          {item.message}
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
                })} */}

              {notificationList && (
                <FlatList
                  data={notificationList.data}
                  renderItem={({ item, index }) => (
                    <Div
                      key={index}
                      flexDir="row"
                      style={{ gap: 20 }}
                      pb={20}
                      mb={20}
                      borderBottomWidth={1}
                      borderBottomColor={
                        index + 1 === notificationList.data.length
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
                        <IconAlertCircle
                          width={24}
                          height={24}
                          color={"#222222"}
                        />
                      </Div>

                      <Div>
                        <Text>{index + 1}</Text>
                        <Text
                          fontSize={"lg"}
                          fontFamily={fontHauoraMedium}
                          color="darkGreyText"
                          mb={8}
                          w={290}
                        >
                          {item.message}
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
                  )}
                  keyExtractor={(item, i) => `${i}`}
                  onEndReached={() => {
                    if (notificationList.data.length > 0) {
                      Alert.alert("page is changing");
                      setPage((prevPage) => prevPage + 1); // Increment page when last item is reached
                    }
                    // fetchData(); // Fetch new notifications
                  }}
                  onEndReachedThreshold={0.01} // Trigger when 10% from the end
                />
              )}

              <ActivityIndicator
                size="large"
                color={colorPrimary}
                style={{ marginHorizontal: "auto" }}
              />
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
