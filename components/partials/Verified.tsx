import { fontHauoraMedium } from "@/constant/constant";
import { Div, Text } from "react-native-magnus";
import { IconCircleCheck } from "@tabler/icons-react-native";

const Verified = () => {
  return (
    <Div flexDir="row" alignItems="center">
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
  );
};

export default Verified;
