import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import {
  fontHauoraBold,
  fontHauoraMedium,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useCaseStore } from "@/store/modules/case";
import { NavigationType } from "@/store/types";
import { CaseQuotesDto } from "@/store/types/case";
import { useRoute } from "@react-navigation/native";
import {
  IconAlertCircle,
  IconAlertCircleFilled,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
} from "@tabler/icons-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Div, Image, ScrollDiv, Tag, Text } from "react-native-magnus";
import PartnerVetStarRating from "./PartnerVetStarRating";
import BottomSheet from "@/components/partials/BottomSheet";
import InformationIcon from "@/components/icons/InformationIcon";
import EssentialCheckIcon from "@/components/icons/EssentialCheckIcon";

const howQuotesWork = [
  {
    title: "Essential",
    text: "Must be performed and can not be deselected",
    icon: <EssentialCheckIcon />,
  },
  {
    title: "Contingent",
    text: "Subject to an essential service and can not be deselected",
    icon: <EssentialCheckIcon fill="#FFC433" color="#222" />,
  },
  {
    title: "Recommended",
    text: "Vet recommended up to you to decide and you can deselect it if you want",
    icon: <EssentialCheckIcon fill="#014EF7" color="#fff" />,
  },
];

const CaseQuoteDescriptionScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const route = useRoute();
  const { casesQuotes, fetchCaseQuotes } = useCaseStore();

  const id = (route.params as Record<string, string>)?.id;
  const caseId = (route.params as Record<string, string>)?.caseId;
  const hasPartnerBooking = (route.params as Record<string, string>)
    ?.hasPartnerBooking;

  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<
    { id: string; label: string; price: number }[]
  >([]);
  const [showQuotesWork, setShowQuotesWork] = useState(false);

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

  const getTotalQuote = () => {
    return selectedServices.reduce(
      (total, service) => total + service.price,
      0
    );
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
      title="Case"
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={loading}
    >
      <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold} mb={20}>
        Service Details
      </Text>

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

          {!hasPartnerBooking && (
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
          )}
        </Div>

        <Div flex={1}>
          <ScrollDiv
            borderBottomWidth={2}
            borderBottomColor="#222"
            showsVerticalScrollIndicator={false}
          >
            {clinicQuote?.services.map((item, i) => (
              <Div mb={16} key={i}>
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
                  hasPartnerBooking={Boolean(hasPartnerBooking)}
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

              <TouchableOpacity onPress={() => setShowQuotesWork(true)}>
                <Div flexDir="row" alignItems="center" style={{ gap: 1 }}>
                  <IconInfoCircleFilled
                    width={16}
                    height={16}
                    color={"#fff"}
                    fill={"#000"}
                  />
                  <Text fontSize={11} fontFamily={fontHauoraMedium}>
                    Understand how quotes work
                  </Text>
                </Div>
              </TouchableOpacity>
            </Div>

            {clinicQuote && (
              <Div>
                <Div flexDir="row" alignItems="flex-end">
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Max{"  "}
                  </Text>
                  <Text fontSize={"3xl"} fontFamily={fontHauoraBold} mb={-2}>
                    AED {getTotalQuote()}
                  </Text>
                </Div>

                <Div flexDir="row" alignItems="flex-end">
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Min{"  "}
                  </Text>
                  <Text fontSize={"lg"} fontFamily={fontHauoraMedium}>
                    AED {getMinQuote(clinicQuote)}
                  </Text>
                </Div>
              </Div>
            )}
          </Div>
        </Div>
      </Div>
      {/* </ScrollDiv> */}

      <ButtonPrimary
        onPress={() => {
          if (hasPartnerBooking) {
            navigation.goBack();
          } else {
            navigation.navigate("PartnerVetScreen", {
              partnerId: clinicQuote?.partner?.id,
              partnerName: clinicQuote?.partner?.name,
              caseId,
              selectedServices,
            });
          }
        }}
      >
        {hasPartnerBooking ? "Go Back" : "Make an Appointment"}
      </ButtonPrimary>

      <Div
        flexDir="row"
        alignItems="center"
        justifyContent="center"
        style={{ gap: 1 }}
        mt={8}
      >
        {/* <IconCircleCheckFilled
          width={16}
          height={16}
          color={"#fff"}
          fill={"#000"}
        /> */}
        <Text ml={4} fontSize={12} fontFamily={fontHauoraSemiBold}>
          Our service is 100% free for pet parents.
        </Text>
      </Div>

      <BottomSheet
        isVisible={showQuotesWork}
        h={400}
        showCloseIcon
        closeButtonStyle={{
          marginLeft: "auto",
          marginBottom: 0,
        }}
        onCloseIconClick={() => {
          setShowQuotesWork(false);
        }}
        barMb={10}
        roundedTop={40}
      >
        <Div px={10}>
          <Div flexDir="row" alignItems="flex-start" mb={22}>
            <InformationIcon width={28} height={28} />
            <Text
              fontSize={14}
              ml={8}
              fontFamily={fontHauoraBold}
              style={{ position: "relative", top: 4 }}
            >
              How Quotations work?
            </Text>
          </Div>

          <Div
            pb={13}
            borderBottomColor="#D0D7DC"
            borderBottomWidth={1}
            mb={15}
          >
            <Text fontSize={13} fontFamily={fontHauoraMedium} mb={10}>
              Type of services
            </Text>
            <Div flexDir="row" justifyContent="space-between">
              {howQuotesWork.map((item, i) => (
                <Div key={i} flexDir="row">
                  {item.icon}

                  <Div ml={4}>
                    <Text fontSize={11} fontFamily={fontHauoraBold} mb={3}>
                      {item.title}
                    </Text>
                    <Text fontSize={8} fontFamily={fontHauoraMedium} maxW={90}>
                      {item.text}
                    </Text>
                  </Div>
                </Div>
              ))}
            </Div>
          </Div>

          <Div>
            <Text fontSize={13} fontFamily={fontHauoraMedium} mb={8}>
              How Min and Max work?
            </Text>

            <Div
              flexDir="row"
              justifyContent="space-between"
              style={{ columnGap: 15 }}
            >
              <Div maxW={140}>
                <Text
                  fontSize={20}
                  fontFamily={fontHauoraSemiBold}
                  color="darkGreyText"
                >
                  Min
                </Text>

                <Text fontSize={10} fontFamily={fontHauoraMedium}>
                  Is the minimum amount you are expected to pay including
                  Essential and Contingent services only
                </Text>
              </Div>

              <Div maxW={171}>
                <Text
                  fontSize={20}
                  fontFamily={fontHauoraSemiBold}
                  color="darkGreyText"
                >
                  Max
                </Text>

                <Text fontSize={10} fontFamily={fontHauoraMedium}>
                  Is the maximum amount you are expected to pay based on your
                  selection and it will not exceed that amount
                </Text>
              </Div>
            </Div>
          </Div>
        </Div>
      </BottomSheet>
    </Layout>
  );
};

export default CaseQuoteDescriptionScreen;

const ProposalDetailCard: React.FC<{
  servicesName: string;
  id: string;
  price: number;
  type: string;
  description: string;
  selectedServices: { id: string; label: string }[];
  onSelect: () => void;
  borderWidth?: number;
  hasPartnerBooking?: boolean;
}> = ({
  id,
  servicesName,
  type,
  price,
  description,
  onSelect,
  selectedServices,
  borderWidth,
  hasPartnerBooking,
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
        disabled={hasPartnerBooking}
      >
        {!hasPartnerBooking &&
          (selectedServices.find((item) => item.id === id) ? (
            <Image
              mr={10}
              mt={2}
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
              mt={2}
              w={20}
              h={20}
              rounded={100}
              borderWidth={2}
              borderColor="#D0D7DC"
            />
          ))}

        <Div flex={1}>
          <Div flexDir="row" alignItems="flex-start" mb={8} w={"100%"}>
            <Div
              flexDir="row"
              alignItems="center"
              flexWrap="wrap"
              style={{ gap: 4 }}
              w={"70%"}
            >
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

              <Tag
                fontSize={11}
                fontFamily={fontHauoraSemiBold}
                color={typeStyles.color}
                bg={typeStyles.bg}
                rounded={40}
                mt={2}
                py={3}
                px={8}
              >
                {type}
              </Tag>
            </Div>

            <Div
              flexDir="row"
              alignItems="center"
              style={{ gap: 12 }}
              ml={"auto"}
            >
              <Div>
                <Text fontSize={"xl"} fontFamily={fontHauoraSemiBold}>
                  AED {price}
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
