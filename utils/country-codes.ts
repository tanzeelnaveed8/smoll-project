import api from "./api";
import * as AsyncStorageService from "./async-storage";
import { CountryApiResDto, CountryCodeDto } from "./types";

export async function getCountryCodes(): Promise<CountryCodeDto[]> {
  const codes = await AsyncStorageService.getItem<CountryCodeDto[] | null>(
    "countryCodes"
  );

  if (codes === null) {
    const { data } = await api.get<CountryApiResDto[]>(
      "https://restcountries.com/v3.1/all?fields=flags,idd,name"
    );

    const refinedData: CountryCodeDto[] = data.map((e) => ({
      flag: e.flags.png,
      name: e.name.common,
      code: e.idd.root + e.idd.suffixes?.[0],
    }));

    return refinedData;
  }

  return codes;
}
