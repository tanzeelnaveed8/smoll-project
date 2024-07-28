import {
  colorErrorText,
  colorPrimary,
  colorSuccessText,
} from "@/constant/constant";
import { CaseDetail, CaseStatusEnum } from "@/store/types/case.d";
import { AxiosError } from "axios";
import dayjs from "dayjs";

export const getCountryCode = (input: string) => {
  // Use a regular expression to match the country code
  const match = input.match(/\((\+\d+)\)/);

  if (match) {
    // Return the country code (including the + symbol)
    return match[1];
  } else {
    // If no match is found, return an empty string
    return "";
  }
};

export const getAxiosErrMsg = (error: AxiosError<any, any>) => {
  if (Array.isArray(error.response?.data?.message)) {
    return error.response?.data?.message[0];
  }

  return error.response?.data?.message;
};

export const getCaseStatusLabel = (
  status?: CaseStatusEnum,
  scheduledAt?: string
) => {
  if (scheduledAt) {
    const currentTime = dayjs();
    const scheduledTime = dayjs(scheduledAt);

    if (currentTime.isAfter(scheduledTime.add(35, "minute"))) {
      return "Scheduled Expired";
    }

    return "Scheduled";
  }

  switch (status) {
    case CaseStatusEnum.OPEN_ESCALATED:
      return "Emergency";
    case CaseStatusEnum.CLOSED:
      return "Closed";
    case CaseStatusEnum.OPEN:
      return "Open";
    default:
      return "";
  }
};

export const getCaseStatusColor = (
  status?: CaseStatusEnum,
  scheduledAt?: string
) => {
  if (scheduledAt) {
    const currentTime = dayjs();
    const scheduledTime = dayjs(scheduledAt);

    if (currentTime.isAfter(scheduledTime.add(35, "minute"))) {
      return colorErrorText;
    }

    return colorSuccessText;
  }

  switch (status) {
    case CaseStatusEnum.OPEN_ESCALATED:
      return colorErrorText;
    case CaseStatusEnum.CLOSED:
      return colorSuccessText;
    default:
      return colorPrimary;
  }
};
