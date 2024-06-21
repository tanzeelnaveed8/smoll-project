import { Button, Div, Icon, Input, Text } from "react-native-magnus";

type PropsType = {
  text: string;
};

const SettingBackButton = (props: PropsType) => {
  const { text } = props;
  return (
    <Div flexDir="row" alignItems="center" mb={4} ml={-8}>
      <Button px={0} py={0} bg="transparent">
        <Icon
          fontSize={32}
          name="chevron-left"
          fontFamily="EvilIcons"
          color="#222222"
          mt={-4}
        />
        <Text fontWeight="400" fontSize="xl" color="#222222">
          {text}
        </Text>
      </Button>
    </Div>
  );
};

export default SettingBackButton;
