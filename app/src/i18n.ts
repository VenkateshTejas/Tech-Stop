import { initReactI18next } from "node_modules/react-i18next";
import HttpApi from "i18next-http-backend";
import i18n from "i18next";

i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    lng: "hi",
    debug: true,
    fallbacklng: "en",
    ns: ["common"],
    backend: { loadPath: "/i18n/{{lng}}/{{ns}}.json" },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
