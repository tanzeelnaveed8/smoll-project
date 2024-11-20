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
  Icon: ReactElement;
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
    Icon,
    title,
    onPress,
    toggleValue,
    disabled,
  } = props;
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Div
        w="full"
        py={16}
        flexDir="row"
        justifyContent="space-between"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="#E0E0E0"
        opacity={disabled ? 0.5 : 1}
      >
        <Div flexDir="row" alignItems="flex-start">
          <Icon color="#222222" size={32} strokeWidth={1.5} />
          <Div alignSelf="center" ml={12}>
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
                maxW={windowWidth < 390 ? 230 : 240}
              >
                {description}
              </Text>
            )}
          </Div>
        </Div>

        {!toggleBtn ? (
          <IconChevronRight fontSize={32} color="#898989" />
        ) : (
          <Toggle
            onPress={onPress}
            on={toggleValue}
            activeBg="#222"
            w={windowWidth < 390 ? 48 : 52}
            h={windowWidth < 390 ? 28 : 32}
          />
        )}
      </Div>
    </TouchableOpacity>
  );
};

export default SettingButton;
