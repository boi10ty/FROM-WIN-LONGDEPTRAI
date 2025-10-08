export const translateText = async (text, targetLang) => {
  try {
    if (!targetLang || targetLang === "en") {
      return text;
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
      text,
    )}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data[0]) {
      const translatedText = data[0]
        .map((item) => item[0])
        .join("")
        .trim();
      return translatedText || text;
    }

    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

export const translateMultiple = async (texts, targetLang) => {
  try {
    const entries = Object.entries(texts);
    const translations = await Promise.all(
      entries.map(async ([key, text]) => {
        const translatedText = await translateText(text, targetLang);
        return [key, translatedText];
      }),
    );

    return Object.fromEntries(translations);
  } catch (error) {
    console.error("Multiple translation error:", error);
    return texts;
  }
};
