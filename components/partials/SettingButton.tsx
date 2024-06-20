import { fontHauora } from "@/constant/constant";
import { Div, Icon, Text, Toggle } from "react-native-magnus";
import { iconFontFamilyType } from "react-native-magnus/lib/typescript/src/ui/icon/icon.type";

type PropsType = {
  iconName: string;
  iconFamily: iconFontFamilyType;
  title: string;
  iconFontSize?: number;
  description?: string;
  toggleBtn?: boolean;
};
function SettingButton(props: PropsType) {
  const {
    iconName,
    iconFamily,
    title,
    iconFontSize = 32,
    description,
    toggleBtn = false,
  } = props;
  return (
    <Div
      w="full"
      py={16}
      flexDir="row"
      justifyContent="space-between"
      alignItems="center"
      borderBottomWidth={1}
      borderBottomColor="#E0E0E0"
    >
      <Div flexDir="row" alignItems="flex-start">
        <Icon
          fontSize={iconFontSize}
          name={iconName}
          fontFamily={iconFamily}
          color="#222222"
          mr={12}
        />
        <Div alignSelf="center">
          <Text
            color="#222222"
            fontWeight="400"
            fontSize={18}
            fontFamily={fontHauora}
            lineHeight={24}
          >
            {title}
          </Text>
          {description && (
            <Text
              color="#494949"
              fontWeight="400"
              fontSize={14}
              fontFamily={fontHauora}
              lineHeight={20}
              maxW={240}
            >
              {description}
            </Text>
          )}
        </Div>
      </Div>

      {!toggleBtn ? (
        <Icon
          fontSize={32}
          name="chevron-right"
          fontFamily="EvilIcons"
          color="#898989"
        />
      ) : (
        <Toggle
          onPress={() => null}
          on={true}
          activeBg="#0189F9"
          w={52}
          h={32}
        />
      )}
    </Div>
  );
}

export default SettingButton;
