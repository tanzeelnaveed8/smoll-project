import Header from "@/components/partials/Header";
import { fontHauoraSemiBold } from "@/constant/constant";
import { Div, Text } from "react-native-magnus";
import DoctorListCard from "@/components/partials/DoctorListCard";

const DoctotsListScreen = () => {
  return (
    <Div pt={20}>
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

        <DoctorListCard />
      </Div>
    </Div>
  );
};

export default DoctotsListScreen;
