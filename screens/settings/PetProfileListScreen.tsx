import React, { useCallback, useEffect, useState } from "react";
import Layout from "@/components/app/Layout";
import {
  fontCooper,
  fontCooperBold,
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
  fontHeading,
} from "@/constant/constant";
import { usePetStore } from "@/store/modules/pet";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import { IconChevronRight, IconSquareRoundedPlus } from "@tabler/icons-react-native";
import { FlatList, TouchableOpacity } from "react-native";
import { Button, Div, Image, ScrollDiv, Skeleton, Text } from "react-native-magnus";
import { Pet } from "@/store/types/pet";
import { useFocusEffect } from "@react-navigation/native";
import rainbowImage from "../../assets//images/rainbow.png";
import AddButton from "@/components/partials/AddButton";

const PetProfileListScreen: React.FC<{ navigation: NavigationType }> = ({ navigation }) => {
  const { fetchPets } = usePetStore();
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetchPets();

      console.log("response", response);
      setPets(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      showBack
      title="My Pets"
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={loading}
    >
      <ScrollDiv style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Div flex={1} pt={20}>
          <Text fontSize={"6xl"} mb={20} fontFamily={fontHeading}>
            Add your pets
          </Text>

          <Div mb={18}>
            {pets &&
              pets.map((item, i) => {
                let image;
                for (let i = 0; i < item.photos.length; i++) {
                  if (item.photos[i]?.url) {
                    image = item.photos[i]?.url;
                  }
                }
                return (
                  <ProfileCard
                    image={image}
                    key={i}
                    name={item.name}
                    isCarePet={Boolean(item.careId)}
                    isDeceased={item.isDeceased}
                    onPress={() => {
                      navigation.navigate("PetProfileDetailsScreen", {
                        petId: item.id,
                      });
                    }}
                    onEnrollPress={() => {
                      navigation.navigate("PetProfileBenefitsScreen", {
                        petId: item?.id,
                      });
                    }}
                  />
                );
              })}
          </Div>

          <AddButton
            text="Add New Pet"
            onPress={() => {
              navigation.navigate("PetProfileScreen", {
                navigateTo: "PetProfileListScreen",
              });
            }}
          />
        </Div>
      </ScrollDiv>
    </Layout>
  );
};

const ProfileCard: React.FC<{
  name: string;
  onPress: () => void;
  image?: string;
  isDeceased?: boolean;
  isCarePet?: boolean;
  onEnrollPress?: () => void;
}> = ({ name, onPress, image, isDeceased, isCarePet, onEnrollPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Div
        flexDir="row"
        alignItems="center"
        my={8}
        rounded={24}
        borderWidth={1}
        overflow="hidden"
        style={{
          borderColor: isCarePet ? "#6e99f0" : "#c7c5c3",
          backgroundColor: isCarePet ? "#6e99f0" : "#FAF8F5",
        }}
      >
        <Div p={12} flexDir="row" justifyContent="space-between" flex={1} rounded={24} bg="#FAF8F5">
          <Div flexDir="row">
            <Div w={68} h={62} justifyContent="flex-end" alignItems="center">
              <Image
                src={
                  image
                    ? image
                    : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
                }
                w={58}
                h={58}
                borderColor="#222"
                borderRadius={7}
              />
            </Div>
            <Text
              fontSize={"xl"}
              color={isCarePet ? "#6e99f0" : "#222"}
              fontFamily={fontHauoraMedium}
              ml={8}
            >
              {name}
            </Text>
          </Div>

          <Div flexDir="row" alignItems="center">
            {isDeceased && <Image ml="auto" mr={10} source={rainbowImage} h={60} w={110} />}
            {!isDeceased && !isCarePet && (
              <Button
                mr={10}
                bg="#fff"
                color="#6e99f0"
                borderWidth={1.5}
                borderColor="#6e99f0"
                fontFamily={fontHauoraBold}
                fontSize="xl"
                py={4}
                rounded={24}
                alignSelf="center"
                px={18}
                onPress={onEnrollPress}
              >
                Enroll
              </Button>
            )}
            <IconChevronRight width={24} height={24} color={isCarePet ? "#6e99f0" : "#222222"} />
          </Div>
        </Div>

        <Div ml="auto" row={true} alignItems="center">
          {/* isCarPet  */}
          {!isDeceased && isCarePet && (
            <Div bg="#6e99f0" py={28} px={12}>
              <Image w={84} h={30} source={require("@/assets/icons/smollcare-member-logo.png")} />
            </Div>
          )}
        </Div>
      </Div>
    </TouchableOpacity>
  );
};

export default PetProfileListScreen;
