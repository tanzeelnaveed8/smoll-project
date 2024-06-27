import BottomSheet from "@/components/partials/BottomSheet";
import ButtonPrimary from "@/components/partials/ButtonPrimary";
import ImageUpload from "@/components/partials/ImageUpload";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { Text, Div, Button } from "react-native-magnus";

type PropTypes = {
  open: boolean;
  onClose: () => void;
};

const PetDetailsModal = (props: PropTypes) => {
  const { open, onClose } = props;
  return (
    <BottomSheet isVisible={open} onCloseIconClick={onClose} h="95%">
      <Text fontSize={32} lineHeight={40} color="#222222" mb={4}>
        Details
      </Text>
      <Text
        fontFamily={fontHauoraMedium}
        fontSize="xl"
        lineHeight={24}
        color="#494949"
        maxW={350}
        mb={24}
      >
        We need your address to suggest the nearest vet clinic for in-clinic
        visits
      </Text>

      <Div mb={24} style={{ gap: 8 }}>
        <Add title="Vaccine or Surgery" />
        <Add title="Date" />
        <Add title="Description" />
      </Div>

      <Div>
        <Text
          fontFamily={fontHauoraSemiBold}
          fontSize="xl"
          lineHeight={24}
          color="#222222"
          mb={8}
        >
          Documents
        </Text>
        <Text
          fontFamily={fontHauoraMedium}
          fontSize="lg"
          lineHeight={24}
          color="#494949"
          mb={4}
        >
          Upload supportive docunments
        </Text>
        <Text
          fontFamily={fontHauoraMedium}
          fontSize="lg"
          lineHeight={24}
          color="#494949"
          mb={16}
        >
          (JPG/JPEG/PNG/PDF) Max size 8 MB{" "}
        </Text>

        <ImageUpload plusIcon={false} w={139} h={150} />
      </Div>
      <Div mt={60}>
        <ButtonPrimary bgColor="primary">Confirm</ButtonPrimary>
      </Div>
    </BottomSheet>
  );
};

function Add({ title }: { title: string }) {
  return (
    <Div
      py={12}
      borderBottomWidth={1}
      borderColor="#D0D7DC"
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text
        fontFamily={fontHauoraSemiBold}
        fontSize="xl"
        lineHeight={24}
        color="#494949"
      >
        {title}
      </Text>

      <Button
        bg="transparent"
        px={0}
        py={0}
        fontFamily={fontHauoraSemiBold}
        fontSize="lg"
        lineHeight={24}
        color="#427594"
      >
        Add
      </Button>
    </Div>
  );
}

export default PetDetailsModal;
