import english from "../language/english";
import vietnamese from "../language/vietnamese";
function getLanguageStrings(language){
    switch(language) {
        case "en":
            return english;
        case "vi":
            return vietnamese;
    }
}

export const languageOptions = [
    { value: "en", label: "🇺🇸 English" },
    { value: "vi", label: "🇻🇳 Tiếng Việt" },
    // { value: "ja", label: "🇯🇵 日本語" },
    // { value: "ko", label: "🇰🇷 한국어" },
    // { value: "zh", label: "🇨🇳 中文" },
    // { value: "hi", label: "🇮🇳 हिन्दी" },
    // { value: "fr", label: "🇫🇷 Français" },
  ];

  const appStrings = {
    appName: "UpSale",
    language: getLanguageStrings(localStorage.getItem("language") || "en"),
  };

  export default appStrings;