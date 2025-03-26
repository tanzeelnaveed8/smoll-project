import Layout from "@/components/app/Layout";
import DoctorListCard from "@/components/partials/DoctorListCard";
import { colorPrimary, fontHauoraSemiBold } from "@/constant/constant";
import { SocketEventEnum } from "@/socket/events";
import { useSocket } from "@/socket/provider";
import { useExpertStore } from "@/store/modules/expert";
import { NavigationType } from "@/store/types";
import { Expert } from "@/store/types/expert";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList } from "react-native";
import { Div, Text } from "react-native-magnus";

const windowHeight = Dimensions.get("window").height;

const ExpertsListScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const socket = useSocket();
  const { fetchExperts, updateExpertStatus, experts, expertDetailMap } =
    useExpertStore();

  // const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleFetchRequests();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on(SocketEventEnum.VET_ONLINE_STATUS_CHANGE, async (data) => {
        const vetId = data?.vetId;
        const isOnline = data?.isOnline;

        updateExpertStatus(vetId, isOnline);
      });
    }

    return () => {
      socket?.off(SocketEventEnum.VET_ONLINE_STATUS_CHANGE);
    };
  }, []);

  const handleFetchRequests = async () => {
    try {
      setIsLoading(true);

      await fetchExperts();

      // setExperts(experts);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      showBack
      title="Chat with Expert"
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={isLoading}
    >
      <FlatList
        data={experts}
        showsVerticalScrollIndicator={false}
        style={{ paddingTop: 20 }}
        // ListHeaderComponent={
        //   <Text
        //     fontSize="xl"
        //     fontFamily={fontHauoraSemiBold}
        //     lineHeight={24}
        //     mb={16}
        //   >
        //     Discover an Expert
        //   </Text>
        // }
        renderItem={({ item, index }) => (
          <DoctorListCard
            mb={index + 1 === experts?.length ? 0 : 20}
            name={item.name}
            speciality={item.designation}
            verified
            isOnline={item.isOnline}
            image={item.profileImg?.url}
            about={item?.about}
            nextAvailable="-"
            onCheckAvailability={() => {
              navigation.navigate("ExpertsListDetailScreen", {
                id: item.id,
              });
            }}
          />
        )}
        keyExtractor={(item, i) => `${i}`}
      />
    </Layout>
  );
};

export default ExpertsListScreen;
