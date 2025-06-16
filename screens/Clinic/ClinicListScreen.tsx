import Layout from "@/components/app/Layout";
import InputField from "@/components/partials/InputField";
import SelectInput from "@/components/partials/SelectInput";
import StarRating from "@/components/partials/StarRating";
import { colorPrimary, fontHauoraBold, fontHauoraSemiBold, fontHeading } from "@/constant/constant";
import { usePartnerStore } from "@/store/modules/partner";
import { NavigationType } from "@/store/types";
import { uaeCities } from "@/utils/country-codes";
import { IconChevronRight, IconCurrentLocation } from "@tabler/icons-react-native";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import { Div, Image, Text, WINDOW_HEIGHT } from "react-native-magnus";

const ClinicListScreen = ({ navigation }: { navigation: NavigationType }) => {
  const { clinics, fetchClinics } = usePartnerStore();
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState<{ label: string; value: string }>();
  const [search, setSearch] = useState<string>();

  const isMounted = useRef(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      await fetchClinics(search, city?.value);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [city]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const delay = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <Layout showBack onBackPress={() => navigation.goBack()} title="Partner Clinics">
      <Div flex={1} style={{ gap: 28 }}>
        <Text fontSize={"5xl"} fontFamily={fontHeading}>
          Book an appointment with our partners clinic
        </Text>
        <Div flexDir="row" alignItems="center">
          <IconCurrentLocation
            size={32}
            color={"#222"}
            strokeWidth={1.2}
            style={{ marginRight: 12 }}
          />

          <SelectInput
            label="Select city"
            options={uaeCities as any}
            onSelect={(val) => {
              setCity(val);
            }}
            disabled={loading}
            selectedValue={city as any}
            mainInputStyle={{
              borderRadius: 40,
              width: "97%",
              height: 34,
              paddingVertical: 1,
              borderWidth: 1.2,
              fontSize: 16,
            }}
          />

          <InputField
            placeholder="Search"
            maxLength={20}
            disabled={loading}
            inputStyle={{
              marginLeft: 4,
              borderRadius: 40,
              height: 34,
              paddingVertical: 1,
              borderWidth: 1.2,
              fontSize: 16,
              width: "97%",
            }}
            value={search}
            returnKeyType="done"
            onChangeText={(search) => setSearch(search)}
          />
        </Div>
        {!loading && (
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
                  borderWidth={1}
                  p={14}
                  mb={20}
                  alignItems="center"
                  rounded={24}
                >
                  <Image
                    alignSelf="flex-start"
                    source={{ uri: item.clinicImg.url }}
                    w={54}
                    h={54}
                    rounded={32}
                  />
                  <Div flex={1}>
                    <Text fontSize={"xl"} fontFamily={fontHauoraBold} lineHeight={24}>
                      {item.name}
                    </Text>
                    {item.city ? (
                      <Div flexDir="row" alignItems="center">
                        <Text
                          fontSize={"md"}
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
                  <IconChevronRight size={24} color={"#222"} />
                </Div>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `${index}`}
            onEndReached={async () => {}}
            onStartReached={async () => {}}
            ListEmptyComponent={
              <Text mt="xl" textAlign="center">
                No clinics found.
              </Text>
            }
          />
        )}

        {loading && (
          <Div flex={1} justifyContent="center" minH={WINDOW_HEIGHT / 1.4}>
            <ActivityIndicator size="large" color={colorPrimary} style={{ marginTop: -80 }} />
          </Div>
        )}
        {/* </Div> */}
        {/* </ScrollDiv> */}
      </Div>
    </Layout>
  );
};

export default ClinicListScreen;
