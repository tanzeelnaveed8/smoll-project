import React, { useState } from "react";
import { Div, Image, Modal, Text } from "react-native-magnus";
import ButtonPrimary from "../partials/ButtonPrimary";
import { IconArrowRight } from "@tabler/icons-react-native";
import { fontHauoraBold, fontHauoraMedium, fontHauoraSemiBold } from "@/constant/constant";
import blueWatch from "@/assets/images/blue-watch.png";
import receiptSlip from "@/assets/images/receipt-slip.png";
import important from "@/assets/images/important.png";

interface BottomPopupProps {
  type: "emergency" | "appointment" | "quotation";
  petName: string;
  onClose: () => void;
}

const popUpTypes = {
  emergency: {
    bgColor: "#f23113",
    title: "Things can't wait!",
    description: (petName: string) => `${petName}'s case must be\nchecked at cinic ASAP!`,
    buttonText: "Proceed",
    icon: {
      image: important,
      h: 180,
      w: 130,
    },
  },
  appointment: {
    bgColor: "#32AF92",
    title: "One last step!",
    description: (petName: string) => `Let's confirm ${petName}'s appointment.`,
    buttonText: "Proceed",
    icon: {
      image: blueWatch,
      h: 170,
      w: 120,
    },
  },
  quotation: {
    bgColor: "#0587F6",
    title: "Quotation has arrived!",
    description: (petName: string) =>
      `Quotation for ${petName}'s\ncase has been recived,\nlet's take a look at it.`,
    buttonText: "View Quotation",
    icon: {
      image: receiptSlip,
      h: 210,
      w: 150,
    },
  },
};

const BottomPopup: React.FC<BottomPopupProps> = ({ type, petName, onClose }) => {
  const [popup, setPopup] = useState(true);
  const handleSwipe = () => {
    onClose();
    setPopup(false);
  };

  return (
    <Modal
      h={"36.4%"}
      roundedTop={24}
      bg={popUpTypes[type].bgColor}
      py={54}
      px={38}
      swipeDirection={["down"]}
      coverScreen={true}
      scrollTo={() => {}}
      scrollOffset={1}
      propagateSwipe={true}
      avoidKeyboard={true}
      isVisible={popup}
      onSwipeComplete={handleSwipe}
      backdropColor="transparent"
    >
      <Div flex={1} row={true} position="relative">
        <Div flex={1} row={false} justifyContent="space-between" h={"100%"} w={"100%"} mr={60}>
          <Div>
            <Text color="#fff" fontSize={25} fontFamily={fontHauoraSemiBold}>
              {popUpTypes[type].title}
            </Text>
            <Text color="#fff" fontSize={18} mt={8} fontFamily={fontHauoraMedium}>
              {popUpTypes[type].description(petName)}
            </Text>
          </Div>
          <ButtonPrimary py={6} maxW={210} bg="#fff" fontWeight="500">
            <Div flex={1} row={true} alignItems="center">
              <Text
                mr={8}
                fontSize={18}
                color={popUpTypes[type].bgColor}
                fontFamily={fontHauoraBold}
              >
                {popUpTypes[type].buttonText}
              </Text>
              <IconArrowRight
                width={34}
                height={34}
                strokeWidth={2.7}
                color={popUpTypes[type].bgColor}
              />
            </Div>
          </ButtonPrimary>
        </Div>
        <Div position="absolute" right={-12} top={20}>
          <Image
            source={popUpTypes[type].icon.image}
            h={popUpTypes[type].icon.h}
            w={popUpTypes[type].icon.w}
            resizeMode="contain"
          />
        </Div>
      </Div>
    </Modal>
  );
};

export default BottomPopup;
