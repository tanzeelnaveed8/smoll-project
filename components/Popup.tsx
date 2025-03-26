import { SocketEventEnum } from "@/socket/events";
import { useSocket } from "@/socket/provider";
import { useUserStore } from "@/store/modules/user";
import { NavigationType } from "@/store/types";
import React, { useEffect, useState } from "react";
import BottomPopup from "./app/BottomPopup";
import { useNavigation } from "@react-navigation/native";

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
      socket.on(SocketEventEnum.CTA_POPUP, async (val) => {
        setActivePopup(val);
      });
    }
    return () => {
      socket?.off(SocketEventEnum.CTA_POPUP);
    };
  }, []);

  useEffect(() => {
    if (user && user.notifInfo) {
      setActivePopup(user.notifInfo);
    }
  }, [user]);

  const handlePopupClose = async () => {
    if (activePopup?.type) {
      await clearPopupNotification(activePopup.type);
    }
    setActivePopup(null);
  };

  return (
    <>
      {activePopup && (
        <BottomPopup
          type={activePopup.type}
          petName={activePopup.data.petName}
          onClose={handlePopupClose}
          onButtonClick={() => {
            navigation.navigate("CaseQuoteDescriptionScreen", {
              id: activePopup.data.partnerId,
              caseId: activePopup.data.caseId,
              hasBooking: activePopup.data.hasBooking,
            });
            handlePopupClose();
          }}
        />
      )}
    </>
  );
};

export default Popup;
