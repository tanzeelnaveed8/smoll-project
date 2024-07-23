import Layout from "@/components/app/Layout";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import {
  colorErrorText,
  colorPrimary,
  colorSuccessText,
  fontHauoraBold,
  fontHauoraSemiBold,
} from "@/constant/constant";
import { useCaseStore } from "@/store/modules/case";
import { NavigationType } from "@/store/types";
import { CaseDetail, CaseStatusEnum } from "@/store/types/case.d";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { Badge, Div, Image, ScrollDiv, Tag, Text } from "react-native-magnus";

const CaseDetailScreen: React.FC<{
  navigation: NavigationType;
}> = ({ navigation }) => {
  const route = useRoute();

  const { caseId } = route.params as Record<string, string>;
  const { fetchCase } = useCaseStore();

  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  useEffect(() => {
    fetchCaseDetail();
  }, []);

  const fetchCaseDetail = async (isRefresh?: boolean) => {
    try {
      if (isRefresh) {
        setIsRefresh(true);
      } else {
        setIsLoading(true);
      }

      const caseDetail = await fetchCase(caseId);

      console.log("case", caseDetail);
      setCaseDetail(caseDetail);
    } finally {
      setIsLoading(false);
      setIsRefresh(false);
    }
  };

  return (
    <Layout
      showBack
      title="Case Detail"
      onBackPress={() => {
        navigation.goBack();
      }}
      loading={isLoading}
    >
      <ScrollDiv
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefresh}
            onRefresh={() => fetchCaseDetail(true)}
            tintColor={colorPrimary}
          />
        }
      >
        <Text fontFamily={fontHauoraBold} fontSize="xl" lineHeight={24} mb={24}>
          Basic Details
        </Text>

        <ReadonlyItem
          field="Status"
          value={
            <Tag
              mt={4}
              color={
                caseDetail?.status === CaseStatusEnum.OPEN_ESCALATED
                  ? colorErrorText
                  : colorSuccessText
              }
            >
              <Text textTransform="capitalize">{caseDetail?.status}</Text>
            </Tag>
          }
          mb={12}
        />

        <ReadonlyItem
          field="Description"
          value={caseDetail?.description ?? ""}
          mb={16}
        />

        <ReadonlyItem
          field="Created At"
          value={dayjs(caseDetail?.createdAt).format("DD MMM YYYY")}
          mb={12}
        />

        <Text
          fontFamily={fontHauoraBold}
          fontSize="xl"
          lineHeight={24}
          mb={24}
          mt={32}
        >
          Expert Details
        </Text>

        <ReadonlyItem
          field="Name"
          value={
            <Div row>
              <Text
                fontFamily={fontHauoraSemiBold}
                fontSize="xl"
                lineHeight={24}
              >
                {caseDetail?.assignedVet?.name}
              </Text>

              <Image
                source={{
                  uri:
                    caseDetail?.assignedVet?.profileImg?.url ??
                    "https://via.placeholder.com/150",
                }}
                w={50}
                h={50}
                rounded={100}
                right={0}
                top={-25}
                position="absolute"
                bg="#eeeeee"
                ml="auto"
              />
            </Div>
          }
          mb={12}
        />

        <ReadonlyItem
          field="Designation"
          value={caseDetail?.assignedVet?.designation ?? ""}
          mb={12}
        />

        <ReadonlyItem field="Note" value={caseDetail?.vetNote ?? "-"} mb={12} />

        <Text
          fontFamily={fontHauoraBold}
          fontSize="xl"
          lineHeight={24}
          mb={24}
          mt={32}
        >
          Pet Details
        </Text>

        <ReadonlyItem
          field="Name"
          value={
            <Div row>
              <Text
                fontFamily={fontHauoraSemiBold}
                fontSize="xl"
                lineHeight={24}
              >
                {caseDetail?.pet?.name}
              </Text>

              <Image
                source={{ uri: caseDetail?.pet?.photos[0]?.url }}
                w={50}
                h={50}
                rounded={100}
                right={0}
                top={-25}
                position="absolute"
                bg="#eeeeee"
                ml="auto"
              />
            </Div>
          }
          mb={12}
        />
        <ReadonlyItem
          field="Age"
          value={caseDetail?.pet?.age.toString() ?? ""}
          mb={12}
        />
        <ReadonlyItem
          field="Weight"
          value={caseDetail?.pet?.weight.toString() + " Kg" ?? ""}
          mb={12}
        />
        <ReadonlyItem
          field="Breed"
          value={caseDetail?.pet?.breed ?? ""}
          mb={32}
        />
      </ScrollDiv>

      <ButtonPrimary onPress={() => navigation.goBack()}>Go Back</ButtonPrimary>
    </Layout>
  );
};

const ReadonlyItem = ({
  field,
  value,
  mb,
}: {
  field: string;
  value: string | React.ReactNode;
  mb?: number;
}) => {
  return (
    <Div pb={16} borderBottomWidth={1} borderColor="#E0E0E0" mb={mb ? mb : 0}>
      <Text
        fontFamily={fontHauoraBold}
        fontSize={"l"}
        // lineHeight={16}
        color="darkGreyText"
      >
        {field}
      </Text>

      {typeof value === "string" ? (
        <Text fontFamily={fontHauoraSemiBold} fontSize="xl" lineHeight={24}>
          {value}
        </Text>
      ) : (
        value
      )}
    </Div>
  );
};

export default CaseDetailScreen;
