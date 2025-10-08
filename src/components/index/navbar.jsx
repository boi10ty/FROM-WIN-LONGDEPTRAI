import { useEffect, useState, useMemo } from "react";
import { detectLanguageFromLocation } from "../../utils/country_to_language.js";
import { translateMultiple } from "../../utils/translate.js";

const Navbar = ({ height }) => {
  const defaultTexts = useMemo(
    () => ({
      home: "Home",
      search: "Search",
      privacyPolicy: "Privacy Policy",
      otherTerms: "Other Terms and Conditions",
      settings: "Settings",
    }),
    [],
  );

  const [texts, setTexts] = useState(defaultTexts);

  const translateAllTexts = async () => {
    try {
      const targetLang = await detectLanguageFromLocation();

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
    translateAllTexts();
  }, []);
  return (
    <>
      <div
        className="container--navbar"
        style={{
          height: `calc(100dvh - ${height}px)`,
        }}
      >
        <div className="container--navbar--child">
          <div className="container--general container--navbar--home">
            <span>
              <i className="fa-solid fa-house"></i>
            </span>
            <span>{texts.home}</span>
          </div>
          <div className="cc container--general container--navbar--search">
            <span>
              <i className="cc fa-solid fa-magnifying-glass"></i>
            </span>
            <span>{texts.search}</span>
          </div>
          <div className="cc container--general container--navbar--lock">
            <span>
              <i className="fa-solid fa-lock"></i>
            </span>
            <span>{texts.privacyPolicy}</span>
          </div>
          <div className="cc container--general container--navbar--alert">
            <span>
              <i className="fa-solid fa-circle-exclamation"></i>
            </span>
            <span>{texts.otherTerms}</span>
          </div>
          <div className="cc container--general container--navbar--setting">
            <span>
              <i className="fa-solid fa-gear"></i>
            </span>
            <span>{texts.settings}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
