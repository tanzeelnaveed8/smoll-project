import { ReactElement } from "react";
import { fontHauora } from "@/constant/constant";
import { Div, Text, Toggle } from "react-native-magnus";
import { IconChevronRight } from "@tabler/icons-react-native";
import { Dimensions, TouchableOpacity } from "react-native";

type PropsType = {
  title: string;
  iconSize?: number;
  description?: string;
  toggleBtn?: boolean;
  onPress?: () => void;
  toggleValue?: boolean;
  disabled?: boolean;
};

const windowWidth = Dimensions.get("window").width;

const SettingButton: React.FC<PropsType> = (props) => {
  const {
    iconSize = 32,
    description,
    toggleBtn = false,
    title,
    onPress,
    toggleValue,
    disabled,
  } = props;
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Div
        w="full"
        py={8}
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        opacity={disabled ? 0.5 : 1}
      >
        <Div flexDir="row" alignItems="flex-start">
          <Div alignSelf="center">
            <Text
              color="#222222"
              fontWeight="400"
              fontSize={"4xl"}
              fontFamily={fontHauora}
              lineHeight={24}
            >
              {title}
            </Text>
          </Div>
        </Div>
      </Div>
    </TouchableOpacity>
  );
};

export default SettingButton;
