import { ToastOptions } from "react-native-toast-notifications";

export const fontHauora = "Hauora";
export const fontHauoraSemiBold = "HauoraSemiBold";
export const fontHauoraMedium = "HauoraMedium";
export const fontHauoraBold = "HauoraBold";

export const fontCooper = "Cooper";
export const fontCooperMedium = "CooperMedium";
export const fontCooperBold = "CooperBold";

/** heading fonts */
export const fontHeading = fontCooper;
export const fontHeadingBold = fontCooperBold;

/** Colors */
export const colorGray49 = "#494949";
export const colorPrimary = "#679FF0";
export const colorTextPrimary = "#494949";
export const colorDisableBg = "#FAF8F5";
export const colorDisableBorder = "#BDBDBD";
export const colorDisableText = "#00000059";
export const colorSuccessText = "#2F6E20";
export const colorErrorText = "#E02A2A";

/** Dev-only: OTP accepted by backend in development to bypass real SMS/email. Change if your backend uses another code. */
export const DEV_BYPASS_OTP = "1234";
/** Dev-only: phone number for "Skip login" – backend must accept this number and DEV_BYPASS_OTP in dev. */
export const DEV_BYPASS_PHONE = "+971500000000";

export const TOAST_CONFIGS: ToastOptions = {
  type: "danger",
  placement: "top",
  textStyle: {
    textTransform: "capitalize",
  },
};
