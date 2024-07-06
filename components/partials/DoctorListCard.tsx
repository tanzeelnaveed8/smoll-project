import { Badge, Button, Div, Text } from "react-native-magnus";
import { IconChevronRight } from "@tabler/icons-react-native";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import Verified from "./Verified";
import DoctorCard from "./DoctorCard";

type PropTypes = {
  name: string;
  speciality: string;
  experience: number;
  verified?: boolean;
  nextAvailable: string;
  mb?: number;
};

const DoctorListCard = (props: PropTypes) => {
  const {
    name,
    speciality,
    experience,
    verified = false,
    nextAvailable,
    mb,
  } = props;
  return (
    <Div pb={20} borderBottomWidth={1} borderColor="#E0E0E0" mb={mb}>
      {/* <Div flexDir="row">
        <Badge
          right={34}
          top={8}
          h={8}
          w={8}
          borderWidth={2}
          borderColor="#fff"
        >
          <Div w={100} h={100} rounded={100} bg="#eeeeee" mr={24}></Div>
        </Badge>
        <Div style={{ gap: 4 }}>
          <Text
            fontFamily={fontHauoraSemiBold}
            fontSize="xl"
            lineHeight={24}
            color="#222222"
          >
            {name}
          </Text>
          <Text
            fontSize="md"
            fontFamily={fontHauoraMedium}
            color="#494949"
            lineHeight={20}
          >
            {speciality}
          </Text>
          <Text
            fontSize="md"
            fontFamily={fontHauoraMedium}
            color="#494949"
            lineHeight={20}
          >
            {experience} yrs of experience
          </Text>

          {verified && <Verified />}
        </Div>
      </Div> */}
      <DoctorCard
        name={name}
        experience={experience}
        speciality={speciality}
        verified={verified}
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
            Next Avaialble at
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
        >
          Check availability
        </Button>
      </Div>
    </Div>
  );
};

export default DoctorListCard;
