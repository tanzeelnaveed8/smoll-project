import { fontHauora } from "@/constant/constant";
import { Div, Icon, Text } from "react-native-magnus";

function SettingButton() {
  return (
    <Div mb={24}>
      <Div
        w="full"
        h={64}
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="#E0E0E0"
      >
        <Div flexDir="row">
          <Icon
            fontSize={42}
            name="user"
            fontFamily="EvilIcons"
            color="#222222"
            mr={12}
          />
          <Text
            color="#222222"
            fontWeight="400"
            fontSize={18}
            fontFamily={fontHauora}
            lineHeight={24}
          >
            Personal Info
          </Text>
        </Div>

        <Icon
          fontSize={32}
          name="chevron-right"
          fontFamily="EvilIcons"
          color="#898989"
        />
      </Div>
    </Div>
  );
}

export default SettingButton;
