import { fontHauora } from "@/constant/constant";
import { Div, Icon, Text } from "react-native-magnus";
import { iconFontFamilyType } from "react-native-magnus/lib/typescript/src/ui/icon/icon.type";

type PropsType = {
  iconName: string;
  iconFamily: iconFontFamilyType;
  title: string;
  iconFontSize?: number;
};
function SettingButton(props: PropsType) {
  const { iconName, iconFamily, title, iconFontSize = 32 } = props;
  return (
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
          fontSize={iconFontSize}
          name={iconName}
          fontFamily={iconFamily}
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
          {title}
        </Text>
      </Div>

      <Icon
        fontSize={32}
        name="chevron-right"
        fontFamily="EvilIcons"
        color="#898989"
      />
    </Div>
  );
}

export default SettingButton;
