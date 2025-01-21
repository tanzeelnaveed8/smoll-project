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
  scheduledAt?: string,
  hasPartnerBooking?: boolean
) => {
  if (scheduledAt) {
    const currentTime = dayjs();
    const scheduledTime = dayjs(scheduledAt);

    if (
      currentTime.isBefore(scheduledTime) &&
      status === CaseStatusEnum.CLOSED
    ) {
      return "Scheduled Cancelled";
    }

    if (hasPartnerBooking) {
      return "Scheduled in Clinic";
    }

    if (currentTime.isAfter(scheduledTime.add(35, "minute"))) {
      return "Scheduled Expired";
    }

    return status === CaseStatusEnum.OPEN ? "Scheduled" : "Scheduled Closed";
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

    if (
      currentTime.isBefore(scheduledTime) &&
      status === CaseStatusEnum.CLOSED
    ) {
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

export const hasAvailabilityDateTimePassed = (
  date: string,
  time: string
): boolean => {
  // const dateTime = dayjs(`${date}T${time}Z`); // need to test it
  // const timeOnly = dateTime.format("HH:mm");
  // const currentTimeOnly = dayjs().format("HH:mm");

  // // If it's not today, it hasn't passed
  // if (dayjs(date).date() !== dayjs().date()) {
  //   return false;
  // }

  // // console.log("currentTimeOnly", currentTimeOnly, "timeOnly", timeOnly);

  // // For today, compare times
  // return currentTimeOnly > time;

  const dateTime = dayjs(`${date}T${time}Z`);
  const timeOnly = dateTime.format("HH:mm");
  const currentTimeOnly = dayjs().format("HH:mm");

  // If it's not today, it hasn't passed
  if (dayjs(date).date() !== dayjs().date()) {
    return false;
  }

  // For today, compare times
  return currentTimeOnly > timeOnly;
};

export const getUserTimezoneOffset = () => {
  const date = new Date();
  const timezoneOffset = -date.getTimezoneOffset();
  const hours = Math.floor(Math.abs(timezoneOffset) / 60);
  const minutes = Math.abs(timezoneOffset) % 60;
  const sign = timezoneOffset >= 0 ? "+" : "-";
  const gmtOffset = `GMT${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  return gmtOffset;
};
