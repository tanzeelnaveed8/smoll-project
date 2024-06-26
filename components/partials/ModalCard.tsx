import { NavigationType } from "@/store/types";
import React, { JSXElementConstructor, ReactElement } from "react";
import { Button, Div, Icon, Modal, Text } from "react-native-magnus";

let initial = true;
const ModalCard: React.FC<{
  onClose?: () => void;
  backBtn?: boolean;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}> = ({ onClose, children, backBtn }) => {
  return (
    <Modal isVisible px={20} pb={30}>
      <Button
        bg="transparent"
        px={0}
        onPress={onClose}
        style={{ alignItems: "center" }}
      >
        <Icon
          fontSize={28}
          color="#222222"
          name={backBtn ? "arrowleft" : "close"}
        />
        {backBtn && (
          <Text fontSize="xl" fontWeight="500" ml={4}>
            Back
          </Text>
        )}
      </Button>
      {children}
    </Modal>
  );
};

export default ModalCard;
