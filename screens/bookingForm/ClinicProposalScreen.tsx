import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import StarRating from "@/components/partials/StarRating";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import React, { useEffect, useState } from "react";
import { Div, Image, Text } from "react-native-magnus";

const ClinicProposalScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  return (
    <Layout
      showBack
      backBtnText=""
      title="Clinic"
      onBackPress={() => {
        navigation.goBack();
      }}
    >
      <Div pt={16} flex={1}>
        <ClincCard
          clinkcName="Harmony Vet Clinic"
          min={120}
          max={645}
          rating={4}
        />

        <Text
          fontSize={"md"}
          fontFamily={fontHauoraSemiBold}
          color="darkGreyText"
          mb={16}
        >
          Services included
        </Text>

        <Div>
          <ProposalDetailCard
            servicesName="Pet Emergency care"
            type="Essential"
            price={120}
            description="Immediate access to vets for urgent consultations, ensuring your pet's health and safety anytime."
          />
          <ProposalDetailCard
            servicesName="Blood sampling"
            type="Recommended"
            price={425}
            description="Schedule and manage blood sample collection for your pet with ease and accuracy through our app."
          />
          <ProposalDetailCard
            servicesName="Trio Test"
            type="Continget"
            price={120}
            description="Comprehensive health screening for your pet, including blood, urine, and stool analysis, all managed through our app."
            isLastChild
          />
        </Div>
      </Div>

      <ButtonPrimary bgColor="primary">Next</ButtonPrimary>
    </Layout>
  );
};

export default ClinicProposalScreen;

const ClincCard: React.FC<{
  clinkcName: string;
  rating: number;
  min: number;
  max: number;
}> = ({ clinkcName, min, max, rating }) => {
  return (
    <Div pb={16} borderBottomWidth={1} borderBottomColor="#D0D7DC" mb={20}>
      <Div mb={16} flexDir="row" alignItems="center">
        <Image
          source={require("../../assets/images/doctor-img.png")}
          w={54}
          h={54}
          rounded={100}
          mr={8}
        />
        <Div>
          <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={6}>
            {clinkcName}
          </Text>
          <Div flexDir="row" alignItems="center" style={{ gap: 8 }}>
            <StarRating size={11} defaultRating={4} columnGap={6} />
            <Text
              fontSize={"lg"}
              fontFamily={fontHauoraMedium}
              color="darkGreyText"
            >
              {rating}/5 Rating
            </Text>
          </Div>
        </Div>
      </Div>

      <Div>
        <Text
          color="darkGreyText"
          fontSize={"md"}
          fontFamily={fontHauoraMedium}
          mb={2}
          lineHeight={24}
        >
          Proposal
        </Text>

        <Div flexDir="row" alignItems="flex-end" style={{ gap: 12 }}>
          <Div flexDir="row">
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraSemiBold}
              mr={5}
              lineHeight={24}
            >
              Min
            </Text>
            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraSemiBold}
              color="primary"
              lineHeight={24}
            >
              ~{min}AED
            </Text>
          </Div>

          <Div flexDir="row">
            <Text
              fontSize={"md"}
              fontFamily={fontHauoraSemiBold}
              mr={5}
              lineHeight={24}
            >
              Max
            </Text>
            <Text
              fontSize={"xl"}
              fontFamily={fontHauoraSemiBold}
              color="primary"
              lineHeight={24}
            >
              ~{max}AED
            </Text>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

const ProposalDetailCard: React.FC<{
  servicesName: string;
  price: number;
  type: "Essential" | "Recommended" | "Continget";
  description: string;
  isLastChild?: boolean;
}> = ({ servicesName, type, price, description, isLastChild }) => {
  const [typeStyles, setTypeStyles] = useState({
    bg: "#E7F3F7",
    color: "#222",
  });

  useEffect(() => {
    if (type === "Essential") {
      setTypeStyles({ bg: "#E7F3F7", color: "#222" });
    } else if (type === "Recommended") {
      setTypeStyles({ bg: "#10AFE1", color: "#fff" });
    } else if (type === "Continget") {
      setTypeStyles({ bg: "#FFC400", color: "##222" });
    }
  }, [type]);

  return (
    <Div
      pb={16}
      borderBottomWidth={1}
      borderColor={isLastChild ? "transparent" : "#D0D7DC"}
      mb={isLastChild ? 0 : 16}
    >
      <Div flexDir="row" alignItems="center" mb={8}>
        <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold} mr={4}>
          {servicesName}
        </Text>

        <Text
          fontSize={12}
          fontFamily={fontHauoraSemiBold}
          px={8}
          py={2}
          rounded={38}
          bg={typeStyles.bg}
          color={typeStyles.color}
          lineHeight={20}
          mt={2}
        >
          {type}
        </Text>

        <Text
          fontSize={"xl"}
          fontFamily={fontHauoraSemiBold}
          color="primary"
          ml={"auto"}
        >
          {price} AED
        </Text>
      </Div>

      <Text
        fontSize={"md"}
        fontFamily={fontHauoraSemiBold}
        lineHeight={24}
        color="darkGreyText"
      >
        {description}
      </Text>
    </Div>
  );
};
