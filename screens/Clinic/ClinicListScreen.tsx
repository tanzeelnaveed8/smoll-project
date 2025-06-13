import Layout from "@/components/app/Layout";
import StarRating from "@/components/partials/StarRating";
import { fontHauoraBold, fontHauoraSemiBold } from "@/constant/constant";
import { usePartnerStore } from "@/store/modules/partner";
import { NavigationType } from "@/store/types";
import { IconChevronRight } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import { Div, Image, Text } from "react-native-magnus";

const TimeTab: React.FC<{ heading: string; time: string; mb?: number }> = ({
  heading,
  time,
  mb,
}) => {
  return (
    <Div flexDir="row" alignItems="center" mb={mb || 0}>
      <Div px={8} py={6} bg="#F4F6F8" rounded={12} mr={8}>
        <Text fontSize={"md"} mb={-1} fontFamily={fontHauoraSemiBold} lineHeight={14}>
          {heading}
        </Text>
      </Div>
      <Text fontSize={"md"} fontFamily={fontHauoraSemiBold} lineHeight={24} color="primary">
        {time}
      </Text>
    </Div>
  );
};

const ClinicListScreen = ({ navigation }: { navigation: NavigationType }) => {
  const { clinics, fetchClinics } = usePartnerStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClinicsFetch = async () => {
      try {
        setLoading(true);
        await fetchClinics();
      } finally {
        setLoading(false);
      }
    };

    handleClinicsFetch();
  }, []);

  return (
    <Layout showBack onBackPress={() => navigation.goBack()} title="Clinics" loading={loading}>
      <Div flex={1}>
        <FlatList
          data={clinics}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              key={item.id}
              onPress={() => {
                navigation.navigate("ClinicDetailScreen", {
                  id: item.id,
                });
              }}
            >
              <Div
                flexDir="row"
                style={{ gap: 16 }}
                pb={16}
                borderBottomWidth={1}
                borderBottomColor="#D0D7DC"
                alignItems="center"
                mb={20}
              >
                <Image
                  alignSelf="flex-start"
                  source={{ uri: item.clinicImg.url }}
                  w={52}
                  h={52}
                  rounded={32}
                />
                <Div flex={1}>
                  <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold} lineHeight={24} mb={4}>
                    {item.name}
                  </Text>

                  <Div>
                    <TimeTab
                      heading={"Opening Hours"}
                      time={
                        item.openingHours
                          ? `${JSON.parse(item.openingHours)?.from} - ${JSON.parse(item.openingHours)?.to}`
                          : "-"
                      }
                    />
                  </Div>

                  {item.specialities.length ? (
                    <Div flexDir="row" flexWrap="wrap" style={{ gap: 8 }} mt={12} mb={6}>
                      {item.specialities.map((item) => (
                        <Div
                          key={item?.id}
                          px={8}
                          py={6}
                          rounded={12}
                          borderWidth={1.2}
                          borderColor="#222"
                        >
                          <Text fontSize={"md"} fontFamily={fontHauoraSemiBold} lineHeight={20}>
                            {item?.name}
                          </Text>
                        </Div>
                      ))}
                    </Div>
                  ) : (
                    <></>
                  )}
                  {item.city ? (
                    <Div mt={4} flexDir="row" alignItems="center">
                      <Div px={8} py={6} bg="#F4F6F8" rounded={12} mr={8}>
                        <Text
                          fontSize={"md"}
                          mb={-1}
                          fontFamily={fontHauoraSemiBold}
                          lineHeight={14}
                        >
                          Location:
                        </Text>
                      </Div>
                      <Text
                        lineHeight={17}
                        textAlignVertical="center"
                        fontFamily={fontHauoraBold}
                        color="#494949"
                      >
                        {item.city}
                      </Text>
                    </Div>
                  ) : (
                    <></>
                  )}
                </Div>
                <IconChevronRight size={32} color={"#222"} />
              </Div>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `${index}`}
          onEndReached={async () => {}}
          onStartReached={async () => {}}
        />
        {/* </Div> */}
        {/* </ScrollDiv> */}
      </Div>
    </Layout>
  );
};

export default ClinicListScreen;
