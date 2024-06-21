import Header from "@/components/partials/Header";
import { Div, Text } from "react-native-magnus";

const DoctotsListScreen = () => {
  return (
    <Div pt={20}>
      <Header title="Find your Doctor" />

      <Div mt={12}>
        <Text fontWeight="600" fontSize="xl" lineHeight={24} mb={20}>
          Discover a veterinarian
        </Text>
      </Div>
    </Div>
  );
};

export default DoctotsListScreen;
