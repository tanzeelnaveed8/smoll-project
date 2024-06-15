import React, { JSXElementConstructor, ReactElement } from "react";
import { Button, Div, Icon, Modal } from "react-native-magnus";

const ModalCard: React.FC<{
  visible: boolean;
  onClose: () => void;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}> = ({ visible, onClose, children }) => {
  return (
    <Modal isVisible={visible} px={20}>
      <Button bg="transparent" px={0} onPress={onClose}>
        <Icon fontSize={28} color="#222222" name="close" />
      </Button>
      {children}
    </Modal>
  );
};

export default ModalCard;
