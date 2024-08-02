import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import { Avatar, Badge, Div, Image, Text } from "react-native-magnus";
import Verified from "./Verified";
import { IconUser } from "@tabler/icons-react-native";

type PropTypes = {
  name: string;
  speciality: string;
  experience: number;
  verified?: boolean;
  slotScreen?: boolean;
  isOnline?: boolean;
  image?: string;
};

const DoctorCard: React.FC<PropTypes> = (props) => {
  const {
    name,
    speciality,
    experience,
    verified = false,
    slotScreen = false,
    isOnline = false,
    image,
  } = props;

  console.log("image", image);

  return (
    <Div flexDir={"row"} justifyContent="space-between">
      <Div flexDir="row" alignItems={slotScreen ? "center" : "flex-start"}>
        {isOnline ? (
          <Badge
            right={slotScreen ? 24 : 34}
            top={8}
            h={8}
            w={8}
            borderWidth={2}
            borderColor="#fff"
          >
            {image ? (
              <Image
                source={{ uri: image }}
                w={100}
                h={100}
                rounded={100}
                bg="#eeeeee"
                mr={slotScreen ? 12 : 24}
              />
            ) : (
              <IconUser size={24} />
            )}
          </Badge>
        ) : image ? (
          <Image
            source={{ uri: image }}
            w={100}
            h={100}
            rounded={100}
            bg="#eeeeee"
            mr={slotScreen ? 12 : 24}
          />
        ) : (
          <Avatar size={100} bg="#eeeeee" mr={slotScreen ? 12 : 24}>
            <IconUser size={40} color="#666" />
          </Avatar>
        )}
        <Div w="full" flexDir="row" justifyContent="space-between">
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
            {!slotScreen && verified && <Verified />}
          </Div>
        </Div>
      </Div>
      {slotScreen && verified && <Verified />}
    </Div>
  );
};

export default DoctorCard;
