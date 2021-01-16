import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  // load translation using xhr -> see /public/locales
  // learn more: https://github.com/i18next/i18next-xhr-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    react: {
      wait: true
    }
  });

// i18n
//   .use(Backend)
//   .use(initReactI18next)
//   .init({
//     lng: 'en',
//     backend: {
//       /* translation file path */
//       loadPath: '/public/locales/{{ns}}/trans.json'
//     },
//     fallbackLng: 'en',
//     debug: true,
//     /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
//     ns: ['translations'],
//     defaultNS: 'translations',
//     keySeparator: false,
//     interpolation: {
//       escapeValue: false,
//       formatSeparator: ','
//     },
//     react: {
//       wait: true
//     }
//   })

export default i18n;