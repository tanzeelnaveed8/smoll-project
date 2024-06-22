import { Badge, Button, Div, Text } from "react-native-magnus";
import { IconChevronRight, IconCircleCheck } from "@tabler/icons-react-native";
import { fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";

const DoctorListCard = () => {
  return (
    <Div pb={20} borderBottomWidth={1} borderColor="#E0E0E0">
      <Div flexDir="row">
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
            Dr. Emily Carter
          </Text>
          <Text
            fontSize="md"
            fontFamily={fontHauoraMedium}
            color="#494949"
            lineHeight={20}
          >
            DVM, GPCERT (FelP)
          </Text>
          <Text
            fontSize="md"
            fontFamily={fontHauoraMedium}
            color="#494949"
            lineHeight={20}
          >
            5 yrs of experience
          </Text>

          <Div flexDir="row">
            <IconCircleCheck size={16} color="#2F6E20" />
            <Text
              fontSize={12}
              fontFamily={fontHauoraMedium}
              color="#494949"
              lineHeight={16}
            >
              Verified
            </Text>
          </Div>
        </Div>
      </Div>

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
            06:45 PM today
          </Text>
        </Div>

        <Button
          bg="#427594"
          rounded={100}
          fontSize="lg"
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
