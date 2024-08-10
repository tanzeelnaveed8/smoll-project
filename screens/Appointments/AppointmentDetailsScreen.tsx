import Layout from "@/components/app/Layout";
import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { IconUserX } from "@tabler/icons-react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Button, Div, Image, Text } from "react-native-magnus";

const AppointmentDetailsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <Layout
      title="Appointment Details"
      showBack
      backBtnText=""
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <Div flex={1} pt={20}>
        <Div
          justifyContent="center"
          alignItems="center"
          pb={24}
          mb={24}
          borderBottomWidth={1}
          borderColor="#D0D7DC"
        >
          <Image
            w={100}
            h={100}
            rounded={100}
            mx={"auto"}
            mb={8}
            source={require("../../assets/images/doctor-img.png")}
          />
          <Text
            fontSize={"xl"}
            fontFamily={fontHauoraSemiBold}
            lineHeight={24}
            mb={4}
          >
            Dr. Steven Turner
          </Text>

          <Text fontSize={12} fontFamily={fontHauoraSemiBold} mb={12}>
            Pet Zone Veterinary Clinic,
          </Text>

          <Text
            fontSize={12}
            fontFamily={fontHauoraSemiBold}
            px={8}
            py={6}
            rounded={37}
            borderWidth={1}
            borderColor="#222"
            mb={16}
          >
            Clinic Visit
          </Text>

          <Text fontSize={12} fontFamily={fontHauoraSemiBold} mb={8}>
            Appointment On
          </Text>

          <Text
            fontSize={"xl"}
            fontFamily={fontHauoraSemiBold}
            lineHeight={24}
            color="primary"
          >
            Thu, 8 Aug - 3: 00PM
          </Text>

          <ButtonPrimary bgColor="primary" mt={24}>
            Join
          </ButtonPrimary>
        </Div>

        <Div>
          <Text
            fontSize={12}
            fontFamily={fontHauoraSemiBold}
            color="darkGreyText"
            mb={8}
          >
            Clinic Location
          </Text>

          <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold} mb={8}>
            Pet Zone Veterinary Clinic,
          </Text>
          <Text fontSize={"md"} fontFamily={fontHauoraMedium} mb={24}>
            Al Wasl Road, Jumeirah, Dubai, UAE - Offering comprehensive pet care
            services in a modern facility.
          </Text>

          <Text
            fontSize={12}
            fontFamily={fontHauoraSemiBold}
            color="darkGreyText"
            mb={8}
          >
            Pet
          </Text>

          <Div flexDir="row" alignItems="center" mb={24}>
            <Image
              w={48}
              h={48}
              rounded={48}
              mr={4}
              source={require("../../assets/images/dog.png")}
            />
            <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold}>
              Lucy
            </Text>
          </Div>

          <Div>
            <TouchableOpacity
              onPress={() => {
                setShowCancelModal(true);
              }}
            >
              <Button
                bg="transparent"
                p={0}
                pointerEvents="none"
                flexDir="row"
                style={{ gap: 12 }}
                alignItems="center"
              >
                <IconUserX width={26} height={26} color={"#427594"} />
                <Text
                  fontSize={"xl"}
                  fontFamily={fontHauoraSemiBold}
                  color="primary"
                >
                  Cancel Booking
                </Text>
              </Button>
            </TouchableOpacity>
          </Div>
        </Div>
      </Div>

      <BottomSheet
        isVisible={showCancelModal}
        h="40%"
        swipeDirection={["down"]}
        showCloseIcon
        onCloseIconClick={() => {
          setShowCancelModal(false);
        }}
        roundedTop={24}
      >
        <Div>
          <Text fontSize={"6xl"} mb={8}>
            Cancel Booking
          </Text>

          <Text fontSize={"md"} fontFamily={fontHauoraMedium} mb={16}>
            Are you sure you want to cancel your appointment with Dr. Emily
            Carter?
          </Text>

          <ButtonPrimary bgColor="danger" mb={12}>
            Yes, Cancel
          </ButtonPrimary>

          <ButtonPrimary bgColor="primary">Keep it Booked</ButtonPrimary>
        </Div>
      </BottomSheet>
    </Layout>
  );
};

export default AppointmentDetailsScreen;
