import { AxiosError } from "axios";

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
