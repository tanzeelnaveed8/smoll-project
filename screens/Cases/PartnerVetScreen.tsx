import Layout from "@/components/app/Layout";
import DoctorListCard from "@/components/partials/DoctorListCard";
import { fontHauoraSemiBold } from "@/constant/constant";
import { usePartnerStore } from "@/store/modules/partner";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, FlatList } from "react-native";
import { Div, ScrollDiv, Text } from "react-native-magnus";

const PartnerVetScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const { partnerVets, fetchPartnerVets } = usePartnerStore();

  const partnerId = (route.params as Record<string, string>)?.partnerId;
  const partnerName = (route.params as Record<string, string>)?.partnerName;

  const [isLoading, setIsLoading] = useState(false);

  const vets = useMemo(
    () => partnerVets.get(partnerId),
    [partnerVets, partnerId]
  );

  useEffect(() => {
    handleFetchRequests();
  }, [partnerId]);

  const handleFetchRequests = async () => {
    try {
      setIsLoading(true);

      if (!vets) {
        await fetchPartnerVets(partnerId);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      showBack
      title={partnerName}
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={isLoading}
    >
      <FlatList
        data={vets ?? []}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text
            fontSize="xl"
            fontFamily={fontHauoraSemiBold}
            lineHeight={24}
            mb={16}
          >
            Find your Doctor
          </Text>
        }
        renderItem={({ item, index }) => (
          <DoctorListCard
            mb={index + 1 === vets?.length ? 0 : 20}
            name={item.name}
            speciality={item.designation}
            experience={item.yearOfExperience}
            verified
            nextAvailable=""
            onCheckAvailability={() => {
              navigation.navigate("PartnerVetDetailScreen", {
                vetId: item.id,
                partnerId: partnerId,
              });
            }}
          />
        )}
        keyExtractor={(item, i) => `${i}`}
      />
    </Layout>
  );
};

export default PartnerVetScreen;
