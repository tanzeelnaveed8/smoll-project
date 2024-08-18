import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import StarRating from "@/components/partials/StarRating";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { useCaseStore } from "@/store/modules/case";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Div, Image, ScrollDiv, Tag, Text } from "react-native-magnus";

const CaseQuoteDescriptionScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const { casesQuotes, fetchCaseQuotes } = useCaseStore();

  const id = (route.params as Record<string, string>)?.id;
  const caseId = (route.params as Record<string, string>)?.caseId;

  const [loading, setLoading] = useState(false);
  const caseQuote = casesQuotes.get(caseId);

  useEffect(() => {
    fetchQuotes();
  }, [id, caseId]);

  const clinicQuote = useMemo(() => {
    return caseQuote?.find((q) => q.partner.id === id);
  }, [caseQuote]);

  const cost = useMemo(() => {
    let min = 0;
    let max = 0;

    clinicQuote?.services.forEach((s) => {
      if (s.label === "Essential") {
        min += s.price;
      }

      max += s.price;
    });

    if (min === 0) {
      min = max;
    }

    return { min, max };
  }, [clinicQuote]);

  const fetchQuotes = async () => {
    try {
      setLoading(true);

      await fetchCaseQuotes(caseId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      showBack
      backBtnText=""
      title={clinicQuote?.partner?.name}
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={loading}
    >
      <ScrollDiv flex={1} pt={20}>
        <ClinicCard
          name={clinicQuote?.partner?.name ?? ""}
          min={cost.min}
          max={cost.max}
          address={clinicQuote?.partner?.address ?? ""}
          img={clinicQuote?.partner?.clinicImg?.url ?? ""}
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
          {clinicQuote?.services.map((item) => (
            <Div mb={16}>
              <ProposalDetailCard
                key={item.id}
                servicesName={item.name}
                type={item.label}
                price={item.price}
                description={item.description}
              />
            </Div>
          ))}
        </Div>
      </ScrollDiv>

      <ButtonPrimary
        bgColor="primary"
        onPress={() =>
          navigation.navigate("PartnerVetScreen", {
            partnerId: clinicQuote?.partner?.id,
            partnerName: clinicQuote?.partner?.name,
            caseId,
          })
        }
      >
        Next
      </ButtonPrimary>
    </Layout>
  );
};

export default CaseQuoteDescriptionScreen;

const ClinicCard: React.FC<{
  name: string;
  img: string;
  address: string;
  // rating: number;
  min: number;
  max: number;
}> = ({ name, img, address, min, max }) => {
  return (
    <Div pb={16} borderBottomWidth={1} borderBottomColor="#D0D7DC" mb={20}>
      <Div mb={16} flexDir="row" alignItems="center">
        <Image
          source={
            img ? { uri: img } : require("../../assets/images/doctor-img.png")
          }
          w={64}
          h={64}
          rounded={100}
          mr={8}
        />
        <Div>
          <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={6}>
            {name}
          </Text>
          <Div
            flexDir="row"
            alignItems="center"
            style={{ gap: 8, maxWidth: 300 }}
          >
            {/* <StarRating size={11} defaultRating={4} columnGap={6} /> */}
            <Text
              fontSize={"lg"}
              fontFamily={fontHauoraMedium}
              color="darkGreyText"
            >
              {address}
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
              {min} AED
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
              {max} AED
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
  type: string;
  description: string;
}> = ({ servicesName, type, price, description }) => {
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
    <Div pb={16} borderBottomWidth={1} borderColor="#D0D7DC">
      <Div flexDir="row" alignItems="center" mb={8}>
        <Div
          flexDir="row"
          flexWrap="wrap"
          alignItems="center"
          style={{ gap: 4 }}
        >
          <Text fontSize={"lg"} fontFamily={fontHauoraSemiBold} mr={4}>
            {servicesName}
          </Text>

          <Tag bg={typeStyles.bg} rounded={40} mb={-1}>
            <Text
              fontSize={12}
              fontFamily={fontHauoraSemiBold}
              color={typeStyles.color}
            >
              {type}
            </Text>
          </Tag>
        </Div>

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
