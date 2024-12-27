import { NavigationProp, RouteProp } from "@react-navigation/native";
import { BaseMessage } from "@sendbird/chat/message";

export type Nullable<T> = T | null;

export type NavigationType = NavigationProp<ReactNavigation.RootParamList> & {
  navigate: (screen: string, params?: object) => void;
};

export type PaymentPageRoute = {
  caseId: string;
  clinicName: string;
  selectedServices: { id: string; label: string; price: number }[];
  vetId: string;
  partnerId: string;
  partnerName: string;
  scheduleAt: string;
  paymentIntentId: string;
  isEmergency?: string;
};

export interface SendBirdExtendedBaseMessage extends BaseMessage {
  message: string;
  plainUrl: string;
  sender: {
    userId: string;
    nickname: string;
    profileUrl: string;
  };
}
