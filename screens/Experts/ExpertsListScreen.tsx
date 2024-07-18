import Layout from "@/components/app/Layout";
import DoctorListCard from "@/components/partials/DoctorListCard";
import { colorPrimary, fontHauoraSemiBold } from "@/constant/constant";
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
  const { fetchExperts } = useExpertStore();

  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleFetchRequests();
  }, []);

  const handleFetchRequests = async () => {
    try {
      setIsLoading(true);

      const experts = await fetchExperts();

      setExperts(experts);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      showBack
      backBtnText=""
      title="Find your Expert"
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={isLoading}
    >
      <FlatList
        data={experts}
        ListHeaderComponent={
          <Text
            fontSize="xl"
            fontFamily={fontHauoraSemiBold}
            lineHeight={24}
            mb={16}
          >
            Discover an Expert
          </Text>
        }
        renderItem={({ item, index }) => (
          <DoctorListCard
            mb={index + 1 === experts.length ? 0 : 20}
            name={item.name}
            speciality={item.designation}
            experience={item.yearsOfExperience ?? 0}
            verified
            isOnline={item.isOnline}
            image={item.profileImg?.url}
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
