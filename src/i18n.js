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
            join: "Join Academy",
            search: "Search...",
            notifications: "Notifications",
            profile: "My Profile",
            logout: "Logout",
            switch_to: "Switch to"
          },
          auth: {
            login_title: "Log in to your specialized learning environment",
            email_id: "Email / ID",
            password: "Password",
            forgot_password: "Forgot password?",
            new_applicant: "New applicant?",
            create_account: "Create an Account",
            signup_title: "Join the Next Gen.",
            signup_subtitle: "Create your specialized profile in seconds and start applying for the top bootcamps at ASTU.",
            full_name: "Full Name",
            confirm_password: "Confirm",
            already_have_account: "Already have an account?"
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
            join: "አካዳሚውን ይቀላቀሉ",
            search: "ፈልግ...",
            notifications: "ማሳወቂያዎች",
            profile: "የእኔ መገለጫ",
            logout: "ውጣ",
            switch_to: "ቀይር ወደ"
          },
          auth: {
            login_title: "ወደ ልዩ የመማሪያ አካባቢዎ ይግቡ",
            email_id: "ኢሜይል / መለያ",
            password: "የይለፍ ቃል",
            forgot_password: "የይለፍ ቃል ረስተዋል?",
            new_applicant: "አዲስ አመልካች?",
            create_account: "መለያ ይፍጠሩ",
            signup_title: "ቀጣዩን ትውልድ ይቀላቀሉ።",
            signup_subtitle: "መገለጫዎን በሰከንዶች ውስጥ ይፍጠሩ እና በአዳማ ሳይንስና ቴክኖሎጂ ዩኒቨርሲቲ ውስጥ ለሚገኙ ምርጥ ቡትካምፖች ማመልከት ይጀምሩ።",
            full_name: "ሙሉ ስም",
            confirm_password: "አረጋግጥ",
            already_have_account: "ቀድሞውኑ መለያ አለዎት?"
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
            join: "Akaadaamii Galmaa'i",
            search: "Barbaadi...",
            notifications: "Beeksisa",
            profile: "Eenyummaa koo",
            logout: "Ba'i",
            switch_to: "Gara ... tti jijjiiri"
          },
          auth: {
            login_title: "Bakka barumsaa kee isa addatti qophaa'etti seeni",
            email_id: "Iimeeyilii / ID",
            password: "Jecha icciitii",
            forgot_password: "Jecha icciitii dagattee?",
            new_applicant: "Nama haaraa galmaa'u?",
            create_account: "Eenyummaa uumi",
            signup_title: "Dhaloota Itti Aanu tti Dabalami.",
            signup_subtitle: "Sekondii muraasa keessatti eenyummaa kee uumuun bootkaampoota gurguddoo ASTU keessatti argamaniif iyyachuu jalqabi.",
            full_name: "Maqaa Guutuu",
            confirm_password: "Mirkaneessi",
            already_have_account: "Eenyummaa qabda?"
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
            join: "ኣካዳሚ ተፀንበሩ",
            search: "ድለዩ...",
            notifications: "መፍለጥያታት",
            profile: "ናተይ መለለዪ",
            logout: "ውፃእ",
            switch_to: "ቀይር ናብ"
          },
          auth: {
            login_title: "ናብ ናይ ፍሉይ ትምህርቲ ከባቢኹም እተዉ",
            email_id: "ኢሜይል / መለለዪ",
            password: "መሕለፊ ቃል",
            forgot_password: "መሕለፊ ቃል ረሲዕኩም?",
            new_applicant: "ሓድሽ አመልካች?",
            create_account: "መለለዪ ፍጠሩ",
            signup_title: "ንቀፃሊ ወለዶ ተፀንበሩ።",
            signup_subtitle: "መለለዪኹም ብካልኢታት ፍጠሩ እሞ ኣብ ASTU ንዝርከቡ ብሉፃት ቡትካምፕታት ምምልካት ጀምሩ።",
            full_name: "ምሉእ ስም",
            confirm_password: "አረጋግፁ",
            already_have_account: "መለያ አሎኹም?"
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
            join: "Ku biir akadeemiyada",
            search: "Raadi...",
            notifications: "Ogeysiisyada",
            profile: "Profile-kayga",
            logout: "Ka bax",
            switch_to: "U beddel"
          },
          auth: {
            login_title: "Soo gal jawigaaga waxbarasho ee gaarka ah",
            email_id: "Iimayl / ID",
            password: "Eraysirka",
            forgot_password: "Ma ilowday eraysirka?",
            new_applicant: "Codsadaha cusub?",
            create_account: "Sameyso Akoon",
            signup_title: "Ku biir Jiilka Xiga.",
            signup_subtitle: "Ku sameyso profile-kaaga ilbidhiqsiyo gudahood oo bilow codsashada bootcamps-ka sare ee ASTU.",
            full_name: "Magaca oo buuxa",
            confirm_password: "Xaqiiji",
            already_have_account: "Horay ma u lahayd akoon?"
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
