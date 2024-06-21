import { fontHauora } from "@/constant/constant";
import { Div, Text } from "react-native-magnus";

type PropTypes = {
  title: string;
};

const Header = (props: PropTypes) => {
  const { title } = props;
  return (
    <Div>
      <Text fontWeight="bold" fontSize="xl" lineHeight={24} textAlign="center">
        {title}
      </Text>
    </Div>
  );
};

export default Header;
