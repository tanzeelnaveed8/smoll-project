import AvailabilityAndDateSelector from "@/components/partials/AvailabilityAndDateSelector";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import Container from "@/components/partials/Container";
import DoctorCard from "@/components/partials/DoctorCard";
import Header from "@/components/partials/Header";
import { Div, Text } from "react-native-magnus";

const SlotBookingScreen = () => {
  return (
    <Div pt={20}>
      <Header title="Book a Slot" />
      <Div bg="#FDF4E3" py={20} mb={20}>
        <Container>
          <DoctorCard
            name="Dr. Emily Carter"
            speciality="DVM, GPCERT (FelP)"
            experience={5}
            verified
            slotScreen
          />
        </Container>
      </Div>

      <Container>
        <ButtonPrimary bgColor="primary">Instant Consultation</ButtonPrimary>
        <Div mt={24}>
          <AvailabilityAndDateSelector />
        </Div>
      </Container>
    </Div>
  );
};

export default SlotBookingScreen;
