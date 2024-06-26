import { Modal, Div, ModalProps } from "react-native-magnus";
import { IconX } from "@tabler/icons-react-native";

interface PropTypes extends ModalProps {
  showCloseIcon?: boolean;
  onCloseIconClick?: () => void;
}

const BottomSheet = (props: PropTypes) => {
  const { children, showCloseIcon = true, ...restProps } = props;
  return (
    <Modal
      isVisible
      h="80%"
      rounded={12}
      p={20}
      swipeDirection={["down"]}
      {...restProps}
    >
      <Div mx="auto" w={44} h={4} rounded={4} bg="#DEDEDE" mb={16} />
      {showCloseIcon ? (
        <IconX size={24} color="#222222" strokeWidth={1.5} />
      ) : (
        <></>
      )}

      <Div mt={16}>{children}</Div>
    </Modal>
  );
};

export default BottomSheet;
