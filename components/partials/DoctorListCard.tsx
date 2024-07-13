import { fontHauoraMedium } from "@/constant/constant";
import { IconChevronRight } from "@tabler/icons-react-native";
import { Button, Div, Text } from "react-native-magnus";
import DoctorCard from "./DoctorCard";

type PropTypes = {
  name: string;
  speciality: string;
  experience: number;
  verified?: boolean;
  nextAvailable: string;
  mb?: number;
  onCheckAvailability?: () => void;
  isOnline?: boolean;
  image?: string;
};

const DoctorListCard: React.FC<PropTypes> = (props) => {
  const {
    name,
    speciality,
    experience,
    verified,
    nextAvailable,
    mb,
    onCheckAvailability,
    isOnline,
    image,
  } = props;

  return (
    <Div pb={20} borderBottomWidth={1} borderColor="#E0E0E0" mb={mb}>
      <DoctorCard
        name={name}
        experience={experience}
        speciality={speciality}
        verified={verified}
        isOnline={isOnline}
        image={image}
      />

      {/* card footer */}
      <Div flexDir="row" mt={17} justifyContent="space-between">
        <Div>
          <Text
            fontSize="md"
            fontFamily={fontHauoraMedium}
            color="#494949"
            lineHeight={20}
          >
            Next Available at
          </Text>
          <Text
            fontSize="md"
            fontFamily={fontHauoraMedium}
            color="#494949"
            lineHeight={20}
          >
            {nextAvailable}
          </Text>
        </Div>

        <Button
          bg="#427594"
          rounded={100}
          fontSize="lg"
          fontFamily={fontHauoraMedium}
          color="#fff"
          py={8}
          px={12}
          suffix={
            <IconChevronRight color="#FFFFFF" size={24} strokeWidth={1.5} />
          }
          lineHeight={24}
          onPress={onCheckAvailability}
        >
          Check availability
        </Button>
      </Div>
    </Div>
  );
};

export default DoctorListCard;
