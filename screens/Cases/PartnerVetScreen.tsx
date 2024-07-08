import Header from "@/components/partials/Header";
import { colorPrimary, fontHauoraSemiBold } from "@/constant/constant";
import { Div, Text, ScrollDiv } from "react-native-magnus";
import DoctorListCard from "@/components/partials/DoctorListCard";
import Container from "@/components/partials/Container";
import Layout from "@/components/app/Layout";
import { ActivityIndicator, Dimensions, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useCasesStore } from "@/store/modules/cases";
import { NavigationType } from "@/store/types";

const doctorList = [
  {
    name: "Dr. Emily Carter",
    speciality: "DVM, GPCERT (FelP)",
    experience: 5,
    verified: true,
    nextAvailable: "06:45 PM today",
  },
  {
    name: "Dr. Emily Carter",
    speciality: "DVM, GPCERT (FelP)",
    experience: 5,
    verified: true,
    nextAvailable: "06:45 PM today",
  },
  {
    name: "Dr. Emily Carter",
    speciality: "DVM, GPCERT (FelP)",
    experience: 5,
    verified: true,
    nextAvailable: "06:45 PM today",
  },
  {
    name: "Dr. Emily Carter",
    speciality: "DVM, GPCERT (FelP)",
    experience: 5,
    verified: true,
    nextAvailable: "06:45 PM today",
  },
];

const windowHeight = Dimensions.get("window").height;

const PartnerVetScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { vetDoctorList, fetchVetDoctors } = useCasesStore();

  useEffect(() => {
    // handleFetchRequests();
  }, []);

  const handleFetchRequests = async () => {
    try {
      setIsLoading(true);

      if (vetDoctorList.length === 0) {
        await fetchVetDoctors();
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <Layout
      showBack
      backBtnText=""
      title="Harmony Vet Clinic"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <ScrollDiv showsVerticalScrollIndicator={false}>
        {/* <Header title="Find your Doctor" /> */}

        <Div mt={12}>
          <Text
            fontSize="xl"
            fontFamily={fontHauoraSemiBold}
            lineHeight={24}
            mb={16}
          >
            Find your Doctor
          </Text>

          {!isLoading && (
            <FlatList
              data={doctorList}
              renderItem={({ item, index }) => (
                <DoctorListCard
                  mb={index + 1 === doctorList.length ? 0 : 20}
                  name="Dr. Emily Carter"
                  speciality="DVM, GPCERT (FelP)"
                  experience={5}
                  verified
                  nextAvailable="06:45 PM today"
                  onCheckAvailability={() => {
                    navigation.navigate("PartnerVetDetailScreen");
                  }}
                />
              )}
              keyExtractor={(item, i) => `${i}`}
            />
          )}

          {isLoading && (
            <Div flex={1} justifyContent="center" minH={windowHeight / 1.4}>
              <ActivityIndicator size="large" color={colorPrimary} />
            </Div>
          )}
        </Div>
      </ScrollDiv>
    </Layout>
  );
};

export default PartnerVetScreen;
