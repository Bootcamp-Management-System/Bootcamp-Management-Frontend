import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          nav: {
            login: "Login",
            join: "Join Academy"
          },
          hero: {
            badge: "Now Recruiting · Cohort 2026",
            title_part1: "Build the",
            title_part2: "Future of",
            title_accent: "Technology.",
            subtitle: "Join the most elite tech community at ASTU. Master industry-standard stacks, contribute to real-world projects, and launch your career.",
            cta_explore: "Explore Bootcamps",
            cta_signup: "Create Account"
          }
        }
      },
      am: {
        translation: {
          nav: {
            login: "ግባ",
            join: "አካዳሚውን ይቀላቀሉ"
          },
          hero: {
            badge: "አሁን በመመልመል ላይ · 2026",
            title_part1: "የቴክኖሎጂን",
            title_part2: "የወደፊት",
            title_accent: "ይገንቡ።",
            subtitle: "በአዳማ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ ታዋቂ የሆነውን የቴክኖሎጂ ማህበረሰብ ይቀላቀሉ። የኢንዱስትሪ ደረጃቸውን የጠበቁ ቴክኖሎጂዎችን ይለማመዱ፣ በተግባራዊ ፕሮጀክቶች ላይ ይሳተፉ እና የስራ ህይወትዎን ይጀምሩ።",
            cta_explore: "ቡትካምፖችን ያስሱ",
            cta_signup: "መለያ ይፍጠሩ"
          }
        }
      },
      om: {
        translation: {
          nav: {
            login: "Seeni",
            join: "Akaadaamii Galmaa'i"
          },
          hero: {
            badge: "Amma Galmeessaa Jirra · 2026",
            title_part1: "Fuuldura",
            title_part2: "Teeknooloojii",
            title_accent: "Ijaari.",
            subtitle: "Hawaasa teeknooloojii olii ASTU keessatti argamu makami. Teeknooloojiiwwan ammayyaa baradhu, pirojeektoota dhugaa irratti hirmaadhu, carraa hojii kee jalqabi.",
            cta_explore: "Bootkaampoota sakatta'i",
            cta_signup: "Eenyummaa uumi"
          }
        }
      },
      ti: {
        translation: {
          nav: {
            login: "እቶ",
            join: "ኣካዳሚ ተፀንበሩ"
          },
          hero: {
            badge: "ሕዚ ንምልምል ኣለና · 2026",
            title_part1: "ንመጻኢ",
            title_part2: "ቴክኖሎጂ",
            title_accent: "ህነፅ።",
            subtitle: "ኣብ ASTU ዝርከብ ብሉፅ ማሕበረሰብ ቴክኖሎጂ ተፀንበሩ። ናይ ኢንዱስትሪ ደረጃ ቴክኖሎጂታት ልመዱ፣ ኣብ ተግባራዊ ፕሮጀክትታት ተሳተፉ፣ ስራሕኩም ድማ ጀመሩ።",
            cta_explore: "ቡትካምፕታት ዳህሰሱ",
            cta_signup: "መለያ ፍጠሩ"
          }
        }
      },
      so: {
        translation: {
          nav: {
            login: "Soo gal",
            join: "Ku biir akadeemiyada"
          },
          hero: {
            badge: "Hadda ayaan qornaynaa · 2026",
            title_part1: "Dhis",
            title_part2: "Mustaqbalka",
            title_accent: "Tiknoolajiyada.",
            subtitle: "Ku biir bulshada tignoolajiyada ee ASTU. Baro tignoolajiyada casriga ah, ka qayb qaado mashruucyo dhab ah, oo bilow shaqadaada.",
            cta_explore: "Baadh Bootcamps",
            cta_signup: "Sameyso Akoon"
          }
        }
      }
    }
  });

export default i18n;
