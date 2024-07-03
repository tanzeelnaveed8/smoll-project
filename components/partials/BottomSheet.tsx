import { Modal, Div, ModalProps, Button } from "react-native-magnus";
import { IconX } from "@tabler/icons-react-native";

interface PropTypes extends ModalProps {
  showCloseIcon?: boolean;
  onCloseIconClick?: () => void;
  barMb?: number;
}

const BottomSheet = (props: PropTypes) => {
  const {
    children,
    showCloseIcon = false,
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
      {showCloseIcon ? (
        <Button px={0} py={0} bg="transparent" onPress={onCloseIconClick}>
          <IconX size={24} color="#222222" strokeWidth={1.5} />
        </Button>
      ) : (
        <></>
      )}

      <Div mt={16}>{children}</Div>
    </Modal>
  );
};

export default BottomSheet;
