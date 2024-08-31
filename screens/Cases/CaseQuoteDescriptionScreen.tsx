import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import {
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useCaseStore } from "@/store/modules/case";
import { NavigationType } from "@/store/types";
import { useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  Checkbox,
  Div,
  Image,
  ScrollDiv,
  Tag,
  Text,
} from "react-native-magnus";
import PartnerVetStarRating from "./PartnerVetStarRating";
import {
  IconCircleCheck,
  IconCircleCheckFilled,
  IconInfoCircle,
  IconInfoCircleFilled,
  IconSquareRoundedCheck,
  IconSquareRoundedCheckFilled,
} from "@tabler/icons-react-native";
import { CaseQuotesDto } from "@/store/types/case";

const CaseQuoteDescriptionScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const { casesQuotes, fetchCaseQuotes } = useCaseStore();

  const id = (route.params as Record<string, string>)?.id;
  const caseId = (route.params as Record<string, string>)?.caseId;

  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<
    { id: string; label: string; price: number }[]
  >([]);
  const caseQuote = casesQuotes.get(caseId);

  useEffect(() => {
    fetchQuotes();
  }, [id, caseId]);

  const clinicQuote = useMemo(() => {
    return caseQuote?.find((q) => q.partner.id === id);
  }, [caseQuote]);

  useEffect(() => {
    if (!clinicQuote) return;
    const servicesData = clinicQuote.services.map((item) => {
      return { id: item.id, label: item.label, price: item.price };
    });

    setSelectedServices(servicesData);
  }, [clinicQuote]);

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

  const handleSelectService = (id: string) => {
    if (selectedServices.find((item) => item.id === id)) {
      const updatedServices = selectedServices.filter((item) => item.id !== id);
      setSelectedServices(updatedServices);
    } else {
      const newService = clinicQuote?.services
        .filter((item) => item.id === id)
        ?.pop();

      if (!newService) return;
      const serviceObj = {
        label: newService.label,
        id: newService.id,
        price: newService.price,
      };
      setSelectedServices([...selectedServices, serviceObj]);
    }
  };

  const fetchQuotes = async () => {
    try {
      setLoading(true);

      await fetchCaseQuotes(caseId);
    } finally {
      setLoading(false);
    }
  };

  const getTotalQuote = (caseQuotes: CaseQuotesDto) => {
    const q = caseQuotes.services.reduce((total, curr) => {
      return total + curr.price;
    }, 0);

    return q;
  };

  const getMinQuote = (caseQuotes: CaseQuotesDto) => {
    let q = 0;
    caseQuotes.services.forEach((service) => {
      if (service.label !== "Recommended") {
        q += service.price;
      }
    });

    return q;
  };

  return (
    <Layout
      showBack
      backBtnText=""
      title={`Case ${caseId}`}
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={loading}
    >
      <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={20}>
        Service Details
      </Text>

      {/* <ScrollDiv flex={1} pt={20} showsVerticalScrollIndicator={false}> */}
      {/* <ClinicCard
          name={clinicQuote?.partner?.name ?? ""}
          min={cost.min}
          max={cost.max}
          address={clinicQuote?.partner?.address ?? ""}
          img={clinicQuote?.partner?.clinicImg?.url ?? ""}
        /> */}

      <Div
        flex={1}
        py={16}
        px={20}
        borderWidth={1}
        borderColor="#222"
        rounded={28}
        mb={20}
      >
        <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
          {clinicQuote?.partner?.name}
        </Text>

        <PartnerVetStarRating rating={4} color="" />

        <Text
          fontSize={"md"}
          color="darkGreyText"
          fontFamily={fontHauoraSemiBold}
          mb={20}
        >
          {clinicQuote?.partner?.address}
        </Text>

        <Div
          mb={24}
          flexDir="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
            Service
          </Text>

          <Div flexDir="row" alignItems="center" style={{ gap: 12 }}>
            <Div flexDir="row" alignItems="center" style={{ gap: 5 }}>
              <Image
                source={require("../../assets/icons/disable-check.png")}
                w={15}
                h={15}
              />

              <Text fontSize={10} fontFamily={fontHauoraMedium}>
                Mandatory
              </Text>
            </Div>

            <Div flexDir="row" alignItems="center" style={{ gap: 5 }}>
              <Image
                source={require("../../assets/icons/check.png")}
                w={15}
                h={15}
              />
              <Text fontSize={10} fontFamily={fontHauoraMedium}>
                Optional
              </Text>
            </Div>
          </Div>
        </Div>

        <Div flex={1}>
          <ScrollDiv borderBottomWidth={2} borderBottomColor="#222">
            {clinicQuote?.services.map((item, i) => (
              <Div mb={16}>
                <ProposalDetailCard
                  key={item.id}
                  id={item.id}
                  servicesName={item.name}
                  type={item.label}
                  price={item.price}
                  description={item.description}
                  borderWidth={clinicQuote?.services.length === i + 1 ? 0 : 1}
                  selectedServices={selectedServices}
                  onSelect={() => {
                    handleSelectService(item.id);
                  }}
                />
              </Div>
            ))}
          </ScrollDiv>

          <Div
            pt={15}
            flexDir="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Div>
              <Text
                fontSize={"xl"}
                fontFamily={fontHauoraSemiBold}
                maxW={200}
                mb={5}
              >
                Upfront transparent pricing
              </Text>

              <Div flexDir="row" alignItems="center" style={{ gap: 1 }}>
                <IconInfoCircleFilled
                  width={16}
                  height={16}
                  fill={"#222"}
                  style={{ marginTop: 2 }}
                />
                <Text fontSize={11} fontFamily={fontHauoraMedium}>
                  Understand how quotes work
                </Text>
              </Div>
            </Div>

            {clinicQuote && (
              <Div>
                <Div flexDir="row" alignItems="flex-end">
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Max{" "}
                  </Text>
                  <Text fontSize={"3xl"} fontFamily={fontHauoraBold} mb={-2}>
                    AED{getTotalQuote(clinicQuote)}
                  </Text>
                </Div>

                <Div flexDir="row" alignItems="flex-end">
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Min{" "}
                  </Text>
                  <Text fontSize={"lg"} fontFamily={fontHauoraMedium}>
                    AED{getMinQuote(clinicQuote)}
                  </Text>
                </Div>
              </Div>
            )}
          </Div>
        </Div>
      </Div>
      {/* </ScrollDiv> */}

      <ButtonPrimary
        bgColor="primary"
        onPress={() =>
          navigation.navigate("PartnerVetScreen", {
            partnerId: clinicQuote?.partner?.id,
            partnerName: clinicQuote?.partner?.name,
            caseId,
            selectedServices,
          })
        }
      >
        Make an Appointment
      </ButtonPrimary>

      <Div
        flexDir="row"
        alignItems="center"
        justifyContent="center"
        style={{ gap: 1 }}
        mt={8}
      >
        <IconCircleCheckFilled
          width={16}
          height={16}
          fill={"#222"}
          style={{ marginTop: 2 }}
        />
        <Text ml={4} fontSize={12} fontFamily={fontHauoraSemiBold}>
          Our service is 100% free for pet parents.
        </Text>
      </Div>
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
  id: string;
  price: number;
  type: string;
  description: string;
  selectedServices: { id: string; label: string }[];
  onSelect: () => void;
  borderWidth?: number;
}> = ({
  id,
  servicesName,
  type,
  price,
  description,
  onSelect,
  selectedServices,
  borderWidth,
}) => {
  const [typeStyles, setTypeStyles] = useState({
    bg: "#E7F3F7",
    color: "#222",
  });

  useEffect(() => {
    if (type === "Essential") {
      setTypeStyles({ bg: "#848484", color: "#fff" });
    } else if (type === "Recommended") {
      setTypeStyles({ bg: "#10AFE1", color: "#fff" });
    } else if (type === "Continget" || type === "Contigent") {
      setTypeStyles({ bg: "#FFC400", color: "#222" });
    }
  }, [type]);

  return (
    <Div pb={16} borderBottomWidth={borderWidth} borderColor="#D0D7DC">
      <TouchableOpacity
        onPress={onSelect}
        style={{
          pointerEvents: type === "Recommended" ? "auto" : "none",
          flexDirection: "row",
        }}
      >
        {selectedServices.find((item) => item.id === id) ? (
          <Image
            mr={10}
            mt={6}
            source={
              type === "Recommended"
                ? require("../../assets/icons/check.png")
                : require("../../assets/icons/disable-check.png")
            }
            w={20}
            h={20}
          />
        ) : (
          <Div
            mr={10}
            mt={6}
            w={20}
            h={20}
            rounded={100}
            borderWidth={2}
            borderColor="#D0D7DC"
          />
        )}

        <Div maxW={"90%"}>
          <Div flexDir="row" alignItems="flex-start" mb={8} w="100%">
            <Text
              fontSize={"lg"}
              fontFamily={fontHauoraSemiBold}
              mr={4}
              maxW={
                type === "Recommended"
                  ? 120
                  : type === "Contingent" || type === "Contigent"
                  ? 145
                  : 160
              }
            >
              {servicesName}
            </Text>

            <Div
              flexDir="row"
              alignItems="center"
              style={{ gap: 12 }}
              ml={"auto"}
            >
              <Text
                fontSize={11}
                fontFamily={fontHauoraSemiBold}
                color={typeStyles.color}
                bg={typeStyles.bg}
                rounded={40}
                mb={-1}
                py={3}
                px={8}
              >
                {type}
              </Text>

              <Div>
                <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
                  AED{price}
                </Text>
              </Div>
            </Div>
          </Div>

          <Text fontSize={13} fontFamily={fontHauoraMedium} maxW={"90%"}>
            {description}
          </Text>
        </Div>
      </TouchableOpacity>
    </Div>
  );
};
