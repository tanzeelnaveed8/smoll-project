import React, { useCallback, useEffect, useState } from "react";
import Layout from "@/components/app/Layout";
import {
  fontCooper,
  fontCooperBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
  fontHeading,
} from "@/constant/constant";
import { usePetStore } from "@/store/modules/pet";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import {
  IconChevronRight,
  IconSquareRoundedPlus,
} from "@tabler/icons-react-native";
import { FlatList, TouchableOpacity } from "react-native";
import {
  Button,
  Div,
  Image,
  ScrollDiv,
  Skeleton,
  Text,
} from "react-native-magnus";
import { Pet } from "@/store/types/pet";
import { useFocusEffect } from "@react-navigation/native";

const PetProfileListScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
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
      title="Pet Profile"
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={loading}
    >
      <ScrollDiv style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Div flex={1} pt={20}>
          <Text fontSize={"6xl"} mb={20} fontFamily={fontHeading}>
            Add your lovely pets
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
                    onPress={() => {
                      navigation.navigate("PetProfileDetailsScreen", {
                        petId: item.id,
                      });
                    }}
                  />
                );
              })}
          </Div>

          <Button
            fontSize={"lg"}
            fontFamily={fontHauoraSemiBold}
            color="primary"
            flexDir="row"
            alignItems="center"
            style={{ gap: 4 }}
            p={0}
            bg="transparent"
            onPress={() => {
              navigation.navigate("PetProfileScreen", {
                navigateTo: "PetProfileListScreen",
              });
            }}
          >
            <IconSquareRoundedPlus
              width={24}
              height={24}
              color={"#427594"}
              style={{ marginTop: 2 }}
            />
            <Text
              color="primary"
              fontSize={"lg"}
              fontFamily={fontHauoraSemiBold}
            >
              Add Pets
            </Text>
          </Button>
        </Div>
      </ScrollDiv>
    </Layout>
  );
};

const ProfileCard: React.FC<{
  name: string;
  onPress: () => void;
  image?: string;
}> = ({ name, onPress, image }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Div
        flexDir="row"
        alignItems="center"
        py={12}
        borderBottomWidth={1}
        borderColor="#D0D7DC"
      >
        <Div w={68} h={62} justifyContent="flex-end" alignItems="center">
          {/* <Image
            source={require("../../assets/images/pet-profile-bg.png")}
            position="absolute"
            w={"100%"}
            h={"100%"}
          /> */}

          <Image
            // source={image ? "" : require("../../assets/images/dog-profile.png")}
            src={
              image
                ? image
                : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
            }
            w={58}
            h={58}
            borderWidth={1.15}
            // borderColor="#fff"
            borderColor="#222"
            borderRadius={7}
          />
        </Div>
        <Text fontSize={"xl"} fontFamily={fontHauoraMedium} ml={8}>
          {name}
        </Text>

        <IconChevronRight
          width={24}
          height={24}
          color={"#222222"}
          style={{ marginLeft: "auto" }}
        />
      </Div>
    </TouchableOpacity>
  );
};

export default PetProfileListScreen;
