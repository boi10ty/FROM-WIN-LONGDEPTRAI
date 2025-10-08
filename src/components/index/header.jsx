import { useEffect, useMemo, useRef, useState } from "react";
import Image from "../../assets/img/icon-fb.png";
import { detectLanguageFromLocation } from "../../utils/country_to_language.js";
import { translateMultiple } from "../../utils/translate.js";
const Header = ({ setHeaderHeight }) => {
  const headerRef = useRef(null);

  const defaultTexts = useMemo(
    () => ({
      helpCenter: "Help Center",
      language: "English",
    }),
    [],
  );

  const [texts, setTexts] = useState(defaultTexts);
  const [currentLanguage, setCurrentLanguage] = useState("English");

  const translateAllTexts = async () => {
    try {
      const targetLang = await detectLanguageFromLocation();

      const languageNames = {
        en: "English",
        vi: "Tiếng Việt",
        fr: "Français",
        es: "Español",
        de: "Deutsch",
        it: "Italiano",
        pt: "Português",
        ja: "日本語",
        ko: "한국어",
        "zh-CN": "简体中文",
        "zh-TW": "繁體中文",
        ar: "العربية",
        th: "ภาษาไทย",
        id: "Bahasa Indonesia",
        ru: "Русский",
      };

      setCurrentLanguage(languageNames[targetLang] || "English");

      if (targetLang === "en") {
        setTexts(defaultTexts);
        return;
      }

      const translatedTexts = await translateMultiple(defaultTexts, targetLang);
      setTexts(translatedTexts);
    } catch (error) {
      console.error("Error translating texts:", error);
      setTexts(defaultTexts);
    }
  };

  useEffect(() => {
    setHeaderHeight(headerRef?.current.offsetHeight);
    translateAllTexts();
  }, []);
  return (
    <header ref={headerRef} className="header">
      <div className="header__content--icon">
        <img src={Image} />
        <span className="header--center--help">{texts.helpCenter}</span>
      </div>
      <div className="header__content--language">
        <div className="header__content--language--icon">
          <i className="fa-solid fa-language"></i>
        </div>
        <span>{currentLanguage}</span>
      </div>
    </header>
  );
};

export default Header;
