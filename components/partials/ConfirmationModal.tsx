import React from "react";
import BottomSheet from "./BottomSheet";
import { Div, Text } from "react-native-magnus";
import { fontHauoraMedium, fontHeading } from "@/constant/constant";
import ButtonPrimary from "./ButtonPrimary";

const ConfirmationModal: React.FC<{
  heading: string;
  text?: string;
  showModal: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  cancelText?: string;
  confirmText?: string;
  cancelBgColor?: string;
  confirmBgColor?: string;
}> = ({
  heading,
  text,
  showModal,
  onClose,
  onConfirm,
  isLoading,
  cancelText,
  confirmText,
  cancelBgColor,
  confirmBgColor,
}) => {
  return (
    <BottomSheet
      isVisible={showModal}
      h="45%"
      showCloseIcon
      onCloseIconClick={onClose}
      roundedTop={24}
    >
      <Div>
        <Text fontSize={"6xl"} mb={8} fontFamily={fontHeading}>
          {heading}
        </Text>

        {text && (
          <Text fontSize={"md"} fontFamily={fontHauoraMedium} mb={16}>
            {text}
          </Text>
        )}

        {cancelText && (
          <ButtonPrimary
            // bgColor={confirmBgColor ? confirmBgColor : "danger"}
            bg={confirmBgColor ? confirmBgColor : "#222"}
            mb={12}
            onPress={onConfirm}
            loading={isLoading}
            disabled={isLoading}
          >
            {`${confirmText}`}
          </ButtonPrimary>
        )}

        {cancelText && (
          <ButtonPrimary
            bg={cancelBgColor ? cancelBgColor : "#222"}
            onPress={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </ButtonPrimary>
        )}
      </Div>
    </BottomSheet>
  );
};

export default ConfirmationModal;
