import BackButton from "@/components/partials/BackButton";
import {
  colorPrimary,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useNotificationStore } from "@/store/modules/notification";
import { NavigationType } from "@/store/types";
import { IconAlertCircle } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import { Div, Text } from "react-native-magnus";

const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
const windowHeight = Dimensions.get("window").height;

const NotificationTestScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const { fetchNotifications, notifications, readAllNotification } =
    useNotificationStore();
  // const [data, setData] = useState<NotificationListDto>([]);

  const [page, setPage] = useState(1);
  const [nextPageId, setNextPageid] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [markAllLoading, setMarkAllLoading] = useState(false);

  useEffect(() => {
    if (notifications && notifications?.data.length > 0) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const fetchedData = await fetchNotifications(page, 20);
        setNextPageid(fetchedData.nextPage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadMore = async () => {
    if (!nextPageId) return;

    return new Promise<void>(async (resolve) => {
      const newPage = page + 1;
      try {
        const fetchedData = await fetchNotifications(newPage, 20); // commented-out for now
        setNextPageid(fetchedData.nextPage); /// commented-out for now
        setPage(newPage);
      } finally {
        resolve();
      }
    });
  };

  const onStartReached = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  const markAllAsRead = async () => {
    try {
      setMarkAllLoading(true);
      await readAllNotification();
    } finally {
      setMarkAllLoading(false);
    }
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const seconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 0) return `${interval} min ago`;
    return `0 min ago`; // Updated to return "0 min ago"
  };

  return (
    <Div flex={1} px={20} bg="#fff">
      <Div
        top={2}
        py={10}
        mb={20}
        flexDir="row"
        alignItems="center"
        position="relative"
      >
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
          text={""}
        />
        <Text
          fontSize={"xl"}
          fontFamily={fontHauoraSemiBold}
          style={styles.pageTitle}
        >
          Notification
        </Text>
      </Div>

      {!isLoading && notifications && notifications.data.length > 0 && (
        <Div mb={24} flexDir="row" justifyContent="space-between">
          <Text fontSize={"lg"} fontFamily={fontHauoraBold}>
            Recent
          </Text>

          <TouchableOpacity onPress={markAllAsRead}>
            <Text fontSize={"lg"} fontFamily={fontHauoraBold} color="primary">
              Mark all as Read
            </Text>
          </TouchableOpacity>
        </Div>
      )}

      <Div>
        <FlatList
          style={{ height: windowHeight - 150 }}
          data={notifications?.data}
          ListEmptyComponent={() => (
            <Div h={600} justifyContent="center" alignItems="center">
              <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
                No Notification found
              </Text>
            </Div>
          )}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <Div
                key={index}
                flexDir="row"
                style={{ gap: 20 }}
                pb={20}
                mb={20}
                borderBottomWidth={1}
                borderBottomColor={
                  index + 1 === notifications?.data.length
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
                  <IconAlertCircle width={24} height={24} color={"#222222"} />
                </Div>

                <Div>
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
                    {timeAgo(item.createdAt)}
                    {/* 01 hours ago */}
                  </Text>
                </Div>
              </Div>
            );
          }}
          onStartReached={onStartReached}
          keyExtractor={(item, i) => i.toString()}
          onEndReached={loadMore} // required, should return a promise
          onEndReachedThreshold={10} // optional
          // showDefaultLoadingIndicators={true} // optional
          activityIndicatorColor={"black"} // optional
          // FooterLoadingIndicator={() => {
          //   return (
          //     <Div pb={20}>
          //       <ActivityIndicator size="large" color={colorPrimary} />
          //     </Div>
          //   );
          // }}
        />

        {/* <Div justifyContent="center">
            <ActivityIndicator size="large" color={colorPrimary} />
          </Div> */}
      </Div>

      {isLoading && (
        <Div justifyContent="center" minH={600}>
          <ActivityIndicator size="large" color={colorPrimary} />
        </Div>
      )}

      {/* {!isLoading && (!notifications || notifications?.data.length === 0) && (
        <Div h={"70%"} justifyContent="center" alignItems="center">
          <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
            No Notification found
          </Text>
        </Div>
      )} */}
    </Div>
  );
};

export default NotificationTestScreen;

const styles = StyleSheet.create({
  pageTitle: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    top: 8,
    zIndex: -1,
  },
});
