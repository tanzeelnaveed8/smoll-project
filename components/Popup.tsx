import { SocketEventEnum } from "@/socket/events";
import { useSocket } from "@/socket/provider";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import React, { useEffect, useState } from "react";
import BottomPopup from "./app/BottomPopup";
import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native-magnus";
import { confirmButtonStyles } from "react-native-modal-datetime-picker";

const Popup: React.FC = () => {
  const navigation = useNavigation<NavigationType>();
  const { user, clearPopupNotification } = useUserStore();

  const socket = useSocket();
  const [activePopup, setActivePopup] = useState<null | {
    type: "emergency" | "appointment" | "quotation";
    data: any;
  }>(null);

  useEffect(() => {
    if (socket) {
      socket.on(SocketEventEnum.CTA_POPUP, (val) => {
        console.log(val, "test");
        // if (val.type === "quote-submitted") {
        setActivePopup({ ...val, type: "emergency" });
        // }
      });
    }
    return () => {
      socket?.off(SocketEventEnum.CTA_POPUP);
    };
  }, [socket]);

  useEffect(() => {
    console.log(user);
    if (user && user.popups.emergency) {
      setActivePopup({ data: { ...user.popups.emergency }, type: "emergency" });
    }
  }, [user]);

  const handlePopupClose = async () => {
    setActivePopup(null);

    try {
      if (activePopup?.type) {
        await clearPopupNotification(activePopup.type);
      }
    } catch (error) {
      console.log("ERROR WITH CLEARING");
    }
  };

  return (
    <>
      {activePopup !== null && (
        <BottomPopup
          type={activePopup?.type}
          petName={activePopup?.data.petName}
          onClose={handlePopupClose}
          onButtonClick={() => {
            handlePopupClose();
            navigation.navigate("CaseQuoteDescriptionScreen", {
              id: activePopup?.data.partnerId,
              caseId: activePopup?.data.caseId,
              hasBooking: activePopup?.data.hasBooking,
            });
          }}
        />
      )}
    </>
  );
};

export default Popup;
