import { fontHauora } from "@/constant/constant";
import { Div, Icon, Text } from "react-native-magnus";

type PropTypes = {
  title: string;
};

const Header = (props: PropTypes) => {
  const { title } = props;
  return (
    <Div flexDir="row" alignItems="center" py={9}>
      <Icon
        name="arrow-left"
        fontFamily="Feather"
        color="#222222"
        fontSize={26}
      />

      <Text fontWeight="600" fontSize="xl" lineHeight={24} mx="auto">
        {title}
      </Text>
    </Div>
  );
};

export default Header;
