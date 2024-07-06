import { fontHauoraMedium } from "@/constant/constant";
import { Button, ButtonProps } from "react-native-magnus";
import { IconArrowLeft } from "@tabler/icons-react-native";
import { TouchableOpacity } from "react-native";

interface PropTypes extends ButtonProps {
  text?: string;
  onPress?: () => void;
}

const BackButton = (props: PropTypes) => {
  const { text = "Back", onPress, ...restProps } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Button
        {...restProps}
        onPress={onPress}
        pointerEvents="none"
        px={0}
        py={0}
        bg="transparent"
        fontFamily={fontHauoraMedium}
        fontSize="xl"
        lineHeight={20}
        color="#222222"
        prefix={
          <IconArrowLeft
            size={28}
            color="#222222"
            strokeWidth={1.5}
            style={{ marginBottom: 4, marginRight: 4 }}
          />
        }
      >
        {text}
      </Button>
    </TouchableOpacity>
  );
};

export default BackButton;
