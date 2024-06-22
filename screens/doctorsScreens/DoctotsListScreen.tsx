import Header from "@/components/partials/Header";
import { fontHauoraSemiBold } from "@/constant/constant";
import { Div, Text, ScrollDiv } from "react-native-magnus";
import DoctorListCard from "@/components/partials/DoctorListCard";

const DoctotsListScreen = () => {
  return (
    <ScrollDiv pt={20} showsVerticalScrollIndicator={false}>
      <Header title="Find your Doctor" />

      <Div mt={12}>
        <Text
          fontSize="xl"
          fontFamily={fontHauoraSemiBold}
          lineHeight={24}
          mb={20}
        >
          Discover a veterinarian
        </Text>

        <Div>
          <DoctorListCard
            name="Dr. Emily Carter"
            speciality="DVM, GPCERT (FelP)"
            experience={5}
            verified
            nextAvailable="06:45 PM today"
          />
          <DoctorListCard
            name="Dr. Emily Carter"
            speciality="DVM, GPCERT (FelP)"
            experience={5}
            verified
            nextAvailable="06:45 PM today"
          />
          <DoctorListCard
            name="Dr. Emily Carter"
            speciality="DVM, GPCERT (FelP)"
            experience={5}
            verified
            nextAvailable="06:45 PM today"
          />
          <DoctorListCard
            name="Dr. Emily Carter"
            speciality="DVM, GPCERT (FelP)"
            experience={5}
            verified
            nextAvailable="06:45 PM today"
          />
        </Div>
      </Div>
    </ScrollDiv>
  );
};

export default DoctotsListScreen;
