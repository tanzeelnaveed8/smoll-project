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
    barMb = 28,
    ...restProps
  } = props;

  return (
    <Modal
      h="80%"
      roundedTop={12}
      pb={20}
      swipeDirection={["down"]}
      coverScreen={true}
      {...restProps}
      onSwipeComplete={onCloseIconClick}
    >
      <Div mx="auto" w={44} h={4} mt={8} rounded={4} bg="#DEDEDE" mb={barMb} />

      {title ? (
        <Div borderBottomColor="#DEDEDE" borderBottomWidth={1}>
          <Div px={20}>
            <Div row justifyContent="space-between" alignItems="center" pb={24}>
              {showCloseIcon ? (
                <Button
                  px={0}
                  py={0}
                  bg="transparent"
                  onPress={onCloseIconClick}
                >
                  <IconX size={24} color="#222222" strokeWidth={1.5} />
                </Button>
              ) : (
                <Div w={24} />
              )}
              <Text
                fontSize={"xl"}
                fontWeight="600"
                textAlign="center"
                flex={1}
              >
                {title}
              </Text>
              <Div w={24} />
            </Div>
          </Div>
        </Div>
      ) : (
        <></>
      )}

      <Div mt={16} px={20} pb={20}>
        {children}
      </Div>
    </Modal>
  );
};

export default BottomSheet;
