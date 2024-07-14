import Layout from "@/components/app/Layout";
import AvailabilityAndDateSelector from "@/components/partials/AvailabilityAndDateSelector";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import Container from "@/components/partials/Container";
import DoctorCard from "@/components/partials/DoctorCard";
import Header from "@/components/partials/Header";
import PartnerVetStarRating from "@/screens/Cases/PartnerVetStarRating";
import Verified from "@/components/partials/Verified";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { useCasesStore } from "@/store/modules/case";
import { NavigationType } from "@/store/types";
import { useEffect, useState } from "react";
import {
  Button,
  Div,
  Text,
  ScrollDiv,
  Image,
  Skeleton,
} from "react-native-magnus";

const availabTime = [
  {
    id: 1,
    day: "Thu, 15  Jun",
    timeSlots: ["10:00am", "11:15am", "1:00pm", "2:00pm", "4:00pm"],
  },
  {
    id: 2,
    day: "Fri, 16  Jun",
    timeSlots: ["10:00am", "11:15am", "1:00pm", "2:00pm", "4:00pm"],
  },
];

const dummyData = [1, 2, 3, 4, 5, 6, 7, 8];

const PartnerVetDetailScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleFetchVetDetails();
  }, []);

  const handleFetchVetDetails = async () => {
    try {
      setIsLoading(true);
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
      title="Dr. Emily Carter"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <ScrollDiv flex={1} showsVerticalScrollIndicator={false}>
        {/* <Header title="Book a Slot" /> */}

        <Div flexDir="row" style={{ gap: 24 }} mb={20}>
          <Image
            source={require("../../assets/images/doctor-img.png")}
            w={100}
            h={100}
            rounded={100}
          />

          <Div style={{ gap: 4 }}>
            <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
              Dr. Emily Carter
            </Text>
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraMedium}
              color="darkGreyText"
            >
              DVM, GPCERT (FelP)
            </Text>
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraMedium}
              color="darkGreyText"
            >
              4 yrs of experience
            </Text>
            <Verified />
          </Div>
        </Div>
        <Div maxW={350} mb={20}>
          <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={4}>
            Address - Harmony Vet Clinic
          </Text>
          <Text
            color="darkGreyText"
            mb={6}
            fontSize={"lg"}
            fontFamily={fontHauoraMedium}
          >
            Villa 12, Street 24, Jumeirah 3, Dubai, United Arab Emirates
          </Text>

          <PartnerVetStarRating rating={4} />
        </Div>

        <Div pb={20} borderTopWidth={1} borderColor="#D0D7DC">
          {/* <ButtonPrimary bgColor="primary">Instant Consultation</ButtonPrimary> */}
          <Div>
            <AvailabilityAndDateSelector />

            <Div mt={16}>
              <Text
                fontFamily={fontHauoraSemiBold}
                fontSize="xl"
                lineHeight={24}
                color="#222222"
                mb={16}
              >
                Availability
              </Text>
              {!isLoading &&
                availabTime.map((t) => (
                  <Div
                    key={t.id}
                    // py={12}
                    pb={12}
                    mb={12}
                    borderBottomWidth={1}
                    borderColor="#E0E0E0"
                  >
                    <Text
                      fontFamily={fontHauoraSemiBold}
                      fontSize="xl"
                      lineHeight={24}
                      color="#222222"
                      mb={12}
                    >
                      {t.day}
                    </Text>
                    <Div flexDir="row" flexWrap="wrap" style={{ gap: 8 }}>
                      {t.timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          fontFamily={fontHauoraMedium}
                          fontSize="lg"
                          lineHeight={20}
                          p={10}
                          borderWidth={1}
                          color={
                            selectedTime === `${t.id}${slot}`
                              ? "#fff"
                              : "#494949"
                          }
                          borderColor="#E0E0E0"
                          rounded={4}
                          bg={
                            selectedTime === `${t.id}${slot}`
                              ? "primary"
                              : "transparent"
                          }
                          onPress={() => {
                            setSelectedTime(`${t.id}${slot}`);
                          }}
                        >
                          {slot}
                        </Button>
                      ))}
                    </Div>
                  </Div>
                ))}

              {isLoading && (
                <Div flex={1}>
                  <Skeleton.Box mt="sm" w={100} h={25} mb={4} />
                  <Div flexDir="row" flexWrap="wrap" style={{ gap: 8 }}>
                    {dummyData.map((item) => (
                      <Skeleton.Box mt="sm" h={40} w={80} />
                    ))}
                  </Div>
                </Div>
              )}
            </Div>
          </Div>
          <Div mt={80}>
            <ButtonPrimary
              onPress={() => {
                navigation.navigate("PartnerVetConfirmationScreen");
              }}
            >
              Proceed
            </ButtonPrimary>
          </Div>
        </Div>
      </ScrollDiv>
    </Layout>
  );
};

export default PartnerVetDetailScreen;
