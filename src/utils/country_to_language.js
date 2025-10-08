export const COUNTRY_TO_LANGUAGE = {
  VN: "vi",
  TH: "th",
  ID: "id",
  MY: "ms",
  PH: "tl",
  SG: "en",
  JP: "ja",
  KR: "ko",
  CN: "zh-CN",
  TW: "zh-TW",
  HK: "zh-TW",
  IN: "hi",
  PK: "ur",
  BD: "bn",
  AE: "ar",
  SA: "ar",
  QA: "ar",
  KW: "ar",
  OM: "ar",
  BH: "ar",
  JO: "ar",
  LB: "ar",
  IQ: "ar",
  SY: "ar",
  YE: "ar",
  IL: "he",
  TR: "tr",
  IR: "fa",
  GB: "en",
  IE: "en",
  FR: "fr",
  DE: "de",
  ES: "es",
  IT: "it",
  PT: "pt",
  NL: "nl",
  BE: "nl",
  PL: "pl",
  RU: "ru",
  UA: "uk",
  CZ: "cs",
  RO: "ro",
  GR: "el",
  SE: "sv",
  NO: "no",
  DK: "da",
  FI: "fi",
  US: "en",
  CA: "en",
  MX: "es",
  BR: "pt",
  AR: "es",
  CL: "es",
  CO: "es",
  PE: "es",
  VE: "es",
  ZA: "en",
  EG: "ar",
  NG: "en",
  KE: "sw",
  MA: "ar",
  DZ: "ar",
  TN: "ar",
  AU: "en",
  NZ: "en",
};

export const getLanguageFromCountry = (countryCode) => {
  if (!countryCode) return "en";

  const upperCode = countryCode.toUpperCase();
  return COUNTRY_TO_LANGUAGE[upperCode] || "en";
};

export const detectLanguageFromLocation = async () => {
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
    const data = await response.json();

    const currentIP = data.ip;
    const countryCode = data.country_code;

    const cachedIP = localStorage.getItem("userIP");
    const cachedLang = localStorage.getItem("userLanguage");

    if (cachedIP === currentIP && cachedLang) {
      return cachedLang;
    }

    const language = getLanguageFromCountry(countryCode);

    localStorage.setItem("userIP", currentIP);
    localStorage.setItem("userLanguage", language);
    localStorage.setItem("userCountry", countryCode);

    return language;
  } catch (error) {
    console.error("Error detecting language:", error);
    return "en";
  }
};
