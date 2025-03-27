import { SocketEventEnum } from "@/socket/events";
import { useSocket } from "@/socket/provider";
import { useExpertStore } from "@/store/modules/expert";
import React, { useEffect } from "react";

export default function SocketListener() {
  const socket = useSocket();
  const { updateExpertStatus } = useExpertStore();

  useEffect(() => {
    if (socket) {
      socket.on(SocketEventEnum.VET_ONLINE_STATUS_CHANGE, async (data) => {
        const vetId = data?.vetId;
        const isOnline = data?.isOnline;

        updateExpertStatus(vetId, isOnline);
      });
    }

    return () => {
      socket?.off(SocketEventEnum.VET_ONLINE_STATUS_CHANGE);
    };
  }, [socket]);
  return <></>;
}
