import api from "./api";
import * as AsyncStorageService from "./async-storage";
import { CountryApiResDto, CountryCodeDto } from "./types";

export async function getCountryCodes(): Promise<CountryCodeDto[]> {
  const codes = await AsyncStorageService.getItem<CountryCodeDto[] | null>("countryCodes");

  if (codes === null) {
    const { data } = await api.get<CountryApiResDto[]>(
      "https://restcountries.com/v3.1/alpha?codes=ae,in&fields=flags,idd,name"
    );

    const refinedData: CountryCodeDto[] = data.map((e) => ({
      flag: e.flags.png,
      name: e.name.common,
      code: e.idd.root + (e.idd.suffixes?.[0] || ""),
    }));

    return refinedData;
  }

  return codes;
}

export const uaeCities = [
  {
    label: "Abu Dhabi Island and Internal Islands City",
    value: "Abu Dhabi Island and Internal Islands City",
  },
  { label: "Abu Dhabi Municipality", value: "abu dhabi municipality" },
  { label: "Adh Dhayd", value: "adh dhayd" },
  { label: "Ajman", value: "ajman" },
  { label: "Ajman City", value: "ajman city" },
  { label: "Al Ain City", value: "al ain city" },
  { label: "Al Ain Municipality", value: "al ain municipality" },
  { label: "Al Batayih", value: "al batayih" },
  { label: "Al Dhafra", value: "al dhafra" },
  { label: "Al Fujairah City", value: "al fujairah city" },
  { label: "Al Fujairah Municipality", value: "al fujairah municipality" },
  { label: "Al Hamriyah", value: "al hamriyah" },
  { label: "Al Madam", value: "al madam" },
  { label: "Al Shamkhah City", value: "al shamkhah city" },
  { label: "Ar Ruways", value: "ar ruways" },
  { label: "Bani Yas City", value: "bani yas city" },
  { label: "Dhaid", value: "dhaid" },
  { label: "Dibba Al Fujairah Municipality", value: "dibba al fujairah municipality" },
  { label: "Dibba Al Hesn", value: "dibba al hesn" },
  { label: "Dibba Al-Fujairah", value: "dibba al-fujairah" },
  { label: "Dibba Al-Hisn", value: "dibba al-hisn" },
  { label: "Dubai", value: "dubai" },
  { label: "Kalba", value: "kalba" },
  { label: "Khalifah A City", value: "khalifah a city" },
  { label: "Khawr Fakkān", value: "khawr fakkān" },
  { label: "Khor Fakkan", value: "khor fakkan" },
  { label: "Manama", value: "manama" },
  { label: "Masfout", value: "masfout" },
  { label: "Milehah", value: "milehah" },
  { label: "Murbaḩ", value: "murbaḩ" },
  { label: "Musaffah", value: "musaffah" },
  { label: "Muzayri‘", value: "muzayri‘" },
  { label: "Ras Al Khaimah", value: "ras al khaimah" },
  { label: "Ras Al Khaimah City", value: "ras al khaimah city" },
  { label: "Reef Al Fujairah City", value: "reef al fujairah city" },
  { label: "Sharjah", value: "sharjah" },
  { label: "Umm AL Quwain", value: "umm aL quwain" },
  { label: "Umm Al Quwain City", value: "umm al quwain city" },
  { label: "Zayed City", value: "zayed city" },
];
