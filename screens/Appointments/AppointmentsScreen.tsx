import Layout from "@/components/app/Layout";
import { fontHauoraBold, fontHauoraSemiBold } from "@/constant/constant";
import { NavigationType } from "@/store/types";
import { IconChevronRight } from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { Div, Image, Text } from "react-native-magnus";

const dummyData = [
  {
    img: "",
    type: "Video Consultation",
    text: "Your upcoming Visit with Dr. Emily Carter",
    petName: "Lucy",
  },
  {
    img: "",
    type: "Video Consultation",
    text: "Your upcoming Visit with Dr. Emily Carter",
    petName: "Lucy",
  },
  {
    img: "",
    type: "Video Consultation",
    text: "Your upcoming Visit with Dr. Emily Carter",
    petName: "Lucy",
  },
  {
    img: "",
    type: "Video Consultation",
    text: "Your upcoming Visit with Dr. Emily Carter",
    petName: "Lucy",
    alert: "Pending",
  },
];

const AppointmentsScreen: React.FC<{ navigation: NavigationType }> = ({
  navigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appointmentsData, setAppointmentsData] = useState<
    null | typeof dummyData
  >(null);

  useEffect(() => {
    setAppointmentsData(dummyData);
  }, []);

  return (
    <Layout showBack backBtnText="" title="Appointments">
      {!isLoading &&
        (!appointmentsData ||
          (appointmentsData && appointmentsData?.length === 0)) && (
          <Div flex={1} justifyContent="center" alignItems="center">
            <Text
              fontSize={"lg"}
              fontFamily={fontHauoraSemiBold}
              color="darkGreyText"
            >
              No Appointment found
            </Text>
          </Div>
        )}

      {!isLoading && appointmentsData && appointmentsData.length > 0 && (
        <Div flex={1} pt={24}>
          <Text
            fontSize={"xl"}
            fontFamily={fontHauoraSemiBold}
            lineHeight={24}
            mb={22}
          >
            Upcoming Appointments
          </Text>

          <Div>
            <FlatList
              data={appointmentsData}
              renderItem={({ item, index }) => (
                <AppointmentCard
                  img={item.img}
                  pet={item.petName}
                  text={item.text}
                  type={item.type}
                  alert={item.alert}
                  isLastChild={index + 1 === appointmentsData.length}
                  onPress={() => {
                    navigation.navigate("AppointmentDetailsScreen");
                  }}
                />
              )}
              keyExtractor={(item, index) => `${index}`}
            />
          </Div>
        </Div>
      )}
    </Layout>
  );
};

export default AppointmentsScreen;

const AppointmentCard: React.FC<{
  type: string;
  img: string;
  text: string;
  pet: string;
  alert?: string;
  isLastChild?: boolean;
  onPress: () => void;
}> = (props) => {
  return (
    <TouchableOpacity style={{ marginBottom: 20 }} onPress={props.onPress}>
      <Div
        flexDir="row"
        pb={16}
        borderBottomWidth={1}
        borderColor={props.isLastChild ? "transparent" : "#D0D7DC"}
      >
        <Image
          w={40}
          h={40}
          rounded={100}
          source={require("../../assets/images/doctor-img.png")}
          mr={16}
        />

        <Div maxW={254}>
          <Div mb={4} flexDir="row" style={{ gap: 4 }}>
            <Text
              fontSize={12}
              fontFamily={fontHauoraSemiBold}
              px={8}
              py={6}
              rounded={37}
              borderWidth={1}
              borderColor="#222"
              style={{ alignSelf: "flex-start" }}
            >
              {props.type}
            </Text>

            {props.alert && (
              <Text
                fontSize={12}
                fontFamily={fontHauoraSemiBold}
                px={8}
                py={6}
                rounded={37}
                borderWidth={1}
                borderColor={
                  props.alert.toLowerCase() === "pending" ? "#E02A2A" : "#222"
                }
                color={
                  props.alert.toLowerCase() === "pending" ? "#E02A2A" : "#222"
                }
                style={{ alignSelf: "flex-start" }}
              >
                {props.alert}
              </Text>
            )}
          </Div>

          <Text
            fontSize={"lg"}
            fontFamily={fontHauoraSemiBold}
            mb={4}
            lineHeight={24}
          >
            {props.text}
          </Text>

          <Text
            fontSize={"md"}
            fontFamily={fontHauoraBold}
            color="darkGreyText"
            mb={4}
          >
            Pet: {props.pet}
          </Text>

          <Text
            fontSize={"xl"}
            fontFamily={fontHauoraSemiBold}
            lineHeight={24}
            color="primary"
          >
            Thu, 8 Aug - 3: 00PM
          </Text>
        </Div>

        <IconChevronRight
          width={32}
          height={32}
          color={"#222"}
          style={{ alignSelf: "center", marginLeft: "auto" }}
        />
      </Div>
    </TouchableOpacity>
  );
};
