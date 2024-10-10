import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import {
  fontCooper,
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
  IconArrowRight,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconInfoCircleFilled,
} from "@tabler/icons-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";
import {
  Button,
  Collapse,
  Div,
  Image,
  ScrollDiv,
  Tag,
  Text,
} from "react-native-magnus";
import PartnerVetStarRating from "./PartnerVetStarRating";
import BottomSheet from "@/components/partials/BottomSheet";
import InformationIcon from "@/components/icons/InformationIcon";
import EssentialCheckIcon from "@/components/icons/EssentialCheckIcon";
import CollapsibleView from "./CollapsibleView";
import CaseQuoteDescriptionModalIcon from "@/components/icons/CaseQuoteDescriptionModalIcon";

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

const serviceTypes = [
  {
    title: "Essential",
    text: "Must be performed and can not be deselected",
    icon: <EssentialCheckIcon width={13} height={14} />,
  },
  {
    title: "Contingent",
    text: "Subject to an essential service and can not be deselected",
    icon: (
      <EssentialCheckIcon fill="#FFC433" color="#222" width={13} height={14} />
    ),
  },
  {
    title: "Recommended",
    text: "Vet recommended up to you to decide and you can deselect it if you want",
    icon: (
      <EssentialCheckIcon fill="#014EF7" color="#fff" width={13} height={14} />
    ),
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

  // const clinicQuote = useMemo(() => {
  //   return (
  //     caseQuote?.find((q) => q.partner.id === id) || {
  //       id: "dummyQuoteId",
  //       note: "Dummy note",
  //       partner: {
  //         id: "dummyId",
  //         name: "Dummy Clinic",
  //         address: "123 Dummy Street",
  //         receptionistName: "Dummy Receptionist",
  //         phone: "1234567890",
  //         email: "dummy@clinic.com",
  //         clinicImg: null, // Adjusted to match Nullable<UploadedFile>
  //         country: "Dummy Country",
  //         city: "Dummy City",
  //         openingHours: "Dummy Opening Hours",
  //         postalCode: "Dummy Postal Code",
  //         state: "Dummy State",
  //         createdAt: new Date(),
  //         timeZone: "Dummy Time Zone",
  //         specialities: [{ id: "dummySpecialityId", name: "Dummy Speciality" }],
  //       },
  //       services: [
  //         {
  //           id: "1",
  //           label: "Essential",
  //           name: "Service 1",
  //           price: 100,
  //           description: "Essential service description",
  //           currency: "AED",
  //           type: "description",
  //         },
  //         {
  //           id: "2",
  //           label: "Recommended",
  //           name: "Service 2",
  //           price: 200,
  //           description: "Recommended service description",
  //           currency: "AED",
  //           type: "description",
  //         },
  //         {
  //           id: "3",
  //           label: "Contingent",
  //           name: "Service 3",
  //           price: 150,
  //           description: "Contingent service description",
  //           currency: "AED",
  //           type: "description",
  //         },
  //       ],
  //     }
  //   );
  // }, [caseQuote]);

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

      {/* <CollapsibleView title="Testing title">
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
          molestias ullam earum? Dolorum assumenda sequi consequatur inventore
          id quas, reprehenderit, error dolor quaerat aliquid magnam, autem ex
          voluptatum tempore fugiat?
        </Text>
      </CollapsibleView> */}

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
              {serviceTypes.map((item) => (
                <Div
                  key={item.title}
                  flexDir="row"
                  alignItems="center"
                  style={{ gap: 4 }}
                >
                  {item.icon}

                  <Text fontSize={9} fontFamily={fontHauoraSemiBold}>
                    {item.title}
                  </Text>
                </Div>
              ))}
              {/* <Div flexDir="row" alignItems="center" style={{ gap: 5 }}>
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
              </Div> */}
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
                  tagType={item.type}
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

          <Div>
            <Div
              pt={15}
              flexDir="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Div flexDir="row" alignItems="flex-end" mb={8}>
                <Div>
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Minimum
                  </Text>
                  <Text
                    fontSize={"5xl"}
                    fontFamily={fontHauoraBold}
                    lineHeight={36}
                  >
                    {getMinQuote(clinicQuote)}
                    <Text fontSize={15} fontFamily={fontHauoraMedium}>
                      {" "}
                      AED
                    </Text>
                  </Text>
                </Div>

                <Div w={80} h={1} mx={20} mb={8} bg="#222" />

                <Div>
                  <Text fontSize={"md"} fontFamily={fontHauoraMedium}>
                    Maximum
                  </Text>

                  <Text
                    fontSize={"5xl"}
                    fontFamily={fontHauoraBold}
                    lineHeight={36}
                  >
                    {getTotalQuote()}
                    <Text fontSize={15} fontFamily={fontHauoraMedium}>
                      {" "}
                      AED
                    </Text>
                  </Text>
                </Div>
              </Div>
            </Div>

            <Text fontSize={20} fontFamily={fontCooper} mb={10}>
              Upfront transparent pricing
            </Text>
          </Div>
        </Div>
      </Div>
      {/* </ScrollDiv> */}

      {/* <ButtonPrimary
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
      </ButtonPrimary> */}

      <Button
        bg="transparent"
        borderWidth={2}
        // alignItems="flex-end"
        rounded={30}
        borderColor="#222"
        py={16}
        w={"100%"}
        onPress={() => {
          if (hasPartnerBooking) {
            navigation.navigate("AppointmentsScreen");
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
        <Text color="#222" fontSize={20} fontFamily={fontHauoraSemiBold}>
          {hasPartnerBooking ? "Go Back" : "Proceed"}
        </Text>

        {!hasPartnerBooking && (
          <IconArrowRight
            width={30}
            height={30}
            color={"#222"}
            style={{ marginBottom: -5, marginLeft: 7 }}
          />
        )}
      </Button>
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
        <TouchableOpacity onPress={() => setShowQuotesWork(true)}>
          <Div flexDir="row" alignItems="center" style={{ gap: 1 }}>
            <IconInfoCircleFilled
              width={16}
              height={16}
              color={"#fff"}
              fill={"#000"}
            />
            <Text fontSize={12} fontFamily={fontHauoraMedium}>
              Understand how quotes work
            </Text>
          </Div>
        </TouchableOpacity>
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
        roundedTop={24}
      >
        <Div flexDir="row" alignItems="flex-start" mb={22}>
          <InformationIcon width={28} height={28} />
          <Text fontSize={"md"} ml={8} fontFamily={fontHauoraBold}>
            How Quotations work?
          </Text>
        </Div>

        <CaseQuoteDescriptionModalIcon />

        {/* <Div pb={13} borderBottomColor="#D0D7DC" borderBottomWidth={1} mb={15}>
          <Text fontSize={13} fontFamily={fontHauoraMedium} mb={10}>
            Type of services
          </Text>
          <Div flexDir="row" justifyContent="space-between">
            {howQuotesWork.map((item, i) => (
              <Div key={i} flexDir="row">
                {item.icon}

                <Div ml={4}>
                  <Text fontSize={12} fontFamily={fontHauoraBold} mb={3}>
                    {item.title}
                  </Text>
                  <Text fontSize={10} fontFamily={fontHauoraMedium} maxW={90}>
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
                fontSize={"xl"}
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
                fontSize={"xl"}
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
          </Div>
        </Div> */}
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
  tagType: string;
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
  tagType,
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

  console.log("type", type);

  return (
    <Div pb={16} borderBottomWidth={borderWidth} borderColor="#D0D7DC">
      <Div
        style={{
          // pointerEvents: type === "Recommended" ? "auto" : "none",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={onSelect}
          disabled={hasPartnerBooking}
          style={{
            pointerEvents: type === "Recommended" ? "auto" : "none",
            marginTop: Platform.OS === "ios" ? 3 : 6,
            marginRight: 8,
          }}
        >
          {/* {!hasPartnerBooking &&
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
            ))} */}

          {type === "Essential" && <EssentialCheckIcon />}
          {type === "Recommended" && (
            <>
              {selectedServices.find((item) => item.id === id) ? (
                <EssentialCheckIcon fill="#014EF7" color="#fff" />
              ) : (
                // <EssentialCheckIcon fill="#f10" color="#fff" />
                <Div
                  w={16}
                  h={17}
                  rounded={100}
                  borderWidth={1.5}
                  borderColor="#014EF7"
                />
              )}
            </>
          )}
          {(type === "Contingent" || type === "Contigent") && (
            <EssentialCheckIcon fill="#FFC433" color="#222" />
          )}
        </TouchableOpacity>

        <CollapsibleView
          type={type}
          servicesName={servicesName}
          price={price}
          description={description}
          key={id}
          tagType={tagType}
        />
      </Div>
    </Div>
  );
};
