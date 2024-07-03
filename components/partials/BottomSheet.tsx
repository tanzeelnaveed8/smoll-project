import { Modal, Div, ModalProps, Button, Text } from "react-native-magnus";
import { IconX } from "@tabler/icons-react-native";

interface Props extends ModalProps {
  showCloseIcon?: boolean;
  onCloseIconClick?: () => void;
  barMb?: number;
  title?: string;
}

const BottomSheet: React.FC<Props> = (props) => {
  const {
    children,
    showCloseIcon = false,
    title,
    onCloseIconClick,
    barMb = 16,
    ...restProps
  } = props;

  return (
    <Modal
      h="80%"
      roundedTop={12}
      p={20}
      swipeDirection={["down"]}
      coverScreen={true}
      {...restProps}
      onSwipeComplete={onCloseIconClick}
    >
      <Div mx="auto" w={44} h={4} rounded={4} bg="#DEDEDE" mb={barMb} />

      <Div>
        <Div row justifyContent="space-between" alignItems="center">
          {showCloseIcon ? (
            <Button px={0} py={0} bg="transparent" onPress={onCloseIconClick}>
              <IconX size={24} color="#222222" strokeWidth={1.5} />
            </Button>
          ) : (
            <Div w={24} /> // Placeholder to maintain space
          )}
          <Text fontSize={"xl"} textAlign="center" flex={1}>
            {title}
          </Text>
          <Div w={24} />
        </Div>
      </Div>

      <Div mt={16}>{children}</Div>
    </Modal>
  );
};

export default BottomSheet;
