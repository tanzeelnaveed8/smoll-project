import Header from "@/components/partials/Header";
import { fontHauoraSemiBold } from "@/constant/constant";
import { Div, Text, ScrollDiv } from "react-native-magnus";
import DoctorListCard from "@/components/partials/DoctorListCard";
import Container from "@/components/partials/Container";
import Layout from "@/components/app/Layout";
import { FlatList } from "react-native";

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

const PartnerVetScreen = () => {
  return (
    <Layout showBack backBtnText="" title="Harmony Vet Clinic">
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

          <Div>
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
                />
              )}
              keyExtractor={(item, i) => `${i}`}
            />
          </Div>
        </Div>
      </ScrollDiv>
    </Layout>
  );
};

export default PartnerVetScreen;
