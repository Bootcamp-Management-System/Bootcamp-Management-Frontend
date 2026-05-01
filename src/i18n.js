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
            switch_to: "Switch to",
            theme: "Switch Theme"
          },
          sidebar: {
            dashboard: "Dashboard",
            recruitment: "Recruitment Hub",
            members: "Members",
            instructors: "Instructors",
            sessions: "Sessions",
            admins: "Admins",
            workspace: "Super Admin Workspace",
            panel: "Panel",
            explore: "Explore Bootcamps",
            enrollments: "My Enrollments",
            applications: "My Applications",
            progress: "Weekly Progress",
            member_hub: "Member Hub",
            main_sec: "Main",
            academy_sec: "Academy",
            tracking_sec: "Tracking",
            admin_sec: "Admin",
            instructor_sec: "Instructor"
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
          },
          stats: {
            students: "Active Students",
            graduates: "Graduates",
            partners: "Global Partners",
            rating: "Average Rating"
          },
          bootcamps: {
            title: "Available Bootcamps",
            subtitle: "Select your path and start your elite training journey today.",
            enroll_now: "Enroll Now",
            no_bootcamps: "No active bootcamps found.",
            view_all: "View All Programs",
            show_less: "Show Less"
          },
          why: {
            title: "Why CSEC",
            accent: "ASTU",
            subtitle: "Intelligence?",
            desc: "We don't just teach code; we build the next generation of technology leaders through specialized focus areas.",
            dev_title: "Development",
            dev_desc: "Master modern full-stack development, mobile engineering, and software architecture.",
            cpd_title: "CPD (Competitive Programming)",
            cpd_desc: "Sharpen your algorithmic thinking and problem-solving skills for global competitions.",
            cyber_title: "Cyber Security",
            cyber_desc: "Dive into offensive security, digital forensics, and network defense.",
            data_title: "Data Science",
            data_desc: "Uncover insights from complex data and build intelligent models."
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
            switch_to: "ቀይር ወደ",
            theme: "ገጽታ ይቀይሩ"
          },
          sidebar: {
            dashboard: "ዳሽቦርድ",
            recruitment: "የምልመላ ማዕከል",
            members: "አባላት",
            instructors: "አስተማሪዎች",
            sessions: "ክፍለ-ጊዜያት",
            admins: "አስተዳዳሪዎች",
            workspace: "ልዩ አስተዳዳሪ የሥራ ቦታ",
            panel: "ፓነል",
            explore: "ቡትካምፖችን ያስሱ",
            enrollments: "የእኔ ምዝገባዎች",
            applications: "የእኔ ማመልከቻዎች",
            progress: "ሳምንታዊ እድገት",
            member_hub: "የአባላት ማዕከል",
            main_sec: "ዋና",
            academy_sec: "አካዳሚ",
            tracking_sec: "ክትትል",
            admin_sec: "አስተዳዳሪ",
            instructor_sec: "አስተማሪ"
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
          },
          stats: {
            students: "ንቁ ተማሪዎች",
            graduates: "ተመራቂዎች",
            partners: "ዓለም አቀፍ አጋሮች",
            rating: "አማካይ ደረጃ"
          },
          bootcamps: {
            title: "ያሉ ቡትካምፖች",
            subtitle: "መንገድዎን ይምረጡ እና የልሂቃን ስልጠና ጉዞዎን ዛሬ ይጀምሩ።",
            enroll_now: "አሁኑኑ ይመዝገቡ",
            no_bootcamps: "ምንም ንቁ ቡትካምፖች አልተገኙም።",
            view_all: "ሁሉንም ፕሮግራሞች ይመልከቱ",
            show_less: "ያነሰ አሳይ"
          },
          why: {
            title: "ለምን CSEC",
            accent: "ASTU",
            subtitle: "መረጃ?",
            desc: "እኛ ኮድ ማስተማር ብቻ አይደለም የምንሰራው፤ በልዩ የትኩረት መስኮች ቀጣዩን የቴክኖሎጂ መሪዎች እንገነባለን።",
            dev_title: "ልማት (Development)",
            dev_desc: "ዘመናዊ የሙሉ-ስታክ ልማት፣ የሞባይል ምህንድስና እና የሶፍትዌር አርክቴክቸርን ይቆጣጠሩ።",
            cpd_title: "ሲፒዲ (ተወዳዳሪ ፕሮግራሚንግ)",
            cpd_desc: "ለዓለም አቀፍ ውድድሮች አልጎሪዝም አስተሳሰብዎን እና ችግር የመፍታት ችሎታዎን ያሳድጉ።",
            cyber_title: "የሳይበር ደህንነት",
            cyber_desc: "ወደ ማጥቃት ደህንነት፣ ዲጂታል ፎረንሲክስ እና የኔትወርክ መከላከያ ዘልቀው ይግቡ።",
            data_title: "የመረጃ ሳይንስ (Data Science)",
            data_desc: "ውስብስብ ከሆኑ መረጃዎች ግንዛቤዎችን ያግኙ እና የማሽን መማሪያን በመጠቀም ብልህ ሞዴሎችን ይገንቡ።"
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
            switch_to: "Gara ... tti jijjiiri",
            theme: "Bifa Jijjiiri"
          },
          sidebar: {
            dashboard: "Dashboard",
            recruitment: "Wiirtuu Galmeessaa",
            members: "Miseensota",
            instructors: "Barsiisota",
            sessions: "Sagantaalee",
            admins: "Admiinota",
            workspace: "Super Admin Workspace",
            panel: "Panel",
            explore: "Bootkaampoota Sakatta'i",
            enrollments: "Galmeewwan koo",
            applications: "Iyyannoowwan koo",
            progress: "Guddina Torbee",
            member_hub: "Member Hub",
            main_sec: "Main",
            academy_sec: "Academy",
            tracking_sec: "Tracking",
            admin_sec: "Admin",
            instructor_sec: "Instructor"
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
          },
          stats: {
            students: "Barattoota Saffisaa",
            graduates: "Eebbifamtoota",
            partners: "Michoota Addunyaa",
            rating: "Sadarkaa Giddu-galeessaa"
          },
          bootcamps: {
            title: "Bootkaampoota Jiran",
            subtitle: "Karaa kee filadhuu har'a deemsa leenjii kee jalqabi.",
            enroll_now: "Amma Galmaa'i",
            no_bootcamps: "Bootkaampii hojjetu hin argamne.",
            view_all: "Sagantaalee Hundaa Ilaali",
            show_less: "Xiqqeessi Agarsiisi"
          },
          why: {
            title: "Maaliif CSEC",
            accent: "ASTU",
            subtitle: "Ogummaa?",
            desc: "Nutii koodii qofa hin barsiisnu; dhaloota itti aanu hoggantoota teeknooloojii ijaarra.",
            dev_title: "Misooma (Development)",
            dev_desc: "Misooma full-stack ammayyaa, injinariingii moobaayilaa fi arkiteekcharri sooftiweerii baradhu.",
            cpd_title: "CPD (Dorgommii Saganteessuu)",
            cpd_desc: "Dorgommiiwwan addunyaatiif dandeettii yaada fi rakkoo hiikuu kee qari.",
            cyber_title: "Nageenya Saayibar",
            cyber_desc: "Nageenya weeraraa, qorannoo dijitaalaa fi ittisa interneetii keessa lixii baradhu.",
            data_title: "Saayinsii Daataa",
            data_desc: "Daataa walxaxaa keessaa hubannoo baasi fi mashiinii larning fayyadamuun moodeloota ijaari."
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
            switch_to: "ቀይር ናብ",
            theme: "ገፅታ ቀይር"
          },
          sidebar: {
            dashboard: "ዳሽቦርድ",
            recruitment: "ማእከል ምልመላ",
            members: "ኣባላት",
            instructors: "መምህራን",
            sessions: "ክፍለ-ግዜያት",
            admins: "ኣመሓደርቲ",
            workspace: "ፍሉይ ኣመሓዳሪ ቦታ",
            panel: "ፓነል",
            explore: "ቡትካምፕታት ዳህሰሱ",
            enrollments: "ናተይ ምዝገባታት",
            applications: "ናተይ ሕቶታት",
            progress: "ሰሙናዊ ዕቤት",
            member_hub: "ማእከል ኣባላት",
            main_sec: "ቀንዲ",
            academy_sec: "ኣካዳሚ",
            tracking_sec: "ክትትል",
            admin_sec: "ኣመሓዳሪ",
            instructor_sec: "መምህር"
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
          },
          stats: {
            students: "ንቑሓት ተመሃሮ",
            graduates: "ተመረቕቲ",
            partners: "ዓለም ለኸ መሻርክቲ",
            rating: "ማእከላይ ደረጃ"
          },
          bootcamps: {
            title: "ዘለዉ ቡትካምፕታት",
            subtitle: "መንገድኹም ምረፁ እሞ ናይ ልሂቃን ስልጠና ጉዕዞኹም ሎሚ ጀምሩ።",
            enroll_now: "ሕዚ ተመዝገቡ",
            no_bootcamps: "ዝኾነ ንቑሕ ቡትካምፕ ኣይተረኸበን።",
            view_all: "ኩሎም ፕሮግራማት ርኣዩ",
            show_less: "ውሑድ አርእይ"
          },
          why: {
            title: "ስለምንታይ CSEC",
            accent: "ASTU",
            subtitle: "መረዳእታ?",
            desc: "ንሕና ኮድ ጥራሕ ኣይኮናን ነምህር፤ ብፍሉያት ናይ ትኹረት ዓውድታት ቀፃሊ ወለዶ መራሕቲ ቴክኖሎጂ ንሃንፅ ኣለና።",
            dev_title: "ልምዓት (Development)",
            dev_desc: "ዘመናዊ ናይ ፉል-ስታክ ልምዓት፣ ሞባይል ኢንጂነሪንግን ሶፍትዌር አርክቴክቸርን ተቆፃፀሩ።",
            cpd_title: "ሲፒዲ (ተወዳዳሪ ፕሮግራሚንግ)",
            cpd_desc: "ንዓለም ለኸ ውድድራት ናይ አልጎሪዝም ኣተሓሳስባኹምን ፀገም ናይ ምፍታሕ ክእለትኩምን ኣማዕብሉ::",
            cyber_title: "ናይ ሳይበር ድሕንነት",
            cyber_desc: "ናብ ናይ ምጥቃዕ ድሕንነት፣ ዲጂታል ፎረንሲክስን ናይ ኔትወርክ ምክልኻልን ዓሚቕኩም እተዉ።",
            data_title: "ናይ መረዳእታ ሳይንስ (Data Science)",
            data_desc: "ካብ ዝተሓላለኹ መረዳእታታት ግንዛበ ረኸቡ፣ ማሽን ለርኒንግ ብምጥቃም ድማ ብልህ ሞዴላት ሃንፁ::"
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
            switch_to: "U beddel",
            theme: "Beddel Mawduuca"
          },
          sidebar: {
            dashboard: "Dashboard",
            recruitment: "Xarunta Qorista",
            members: "Xubnaha",
            instructors: "Macalimiinta",
            sessions: "Fadhiyada",
            admins: "Maamulayaasha",
            workspace: "Super Admin Workspace",
            panel: "Panel",
            explore: "Baadh Bootcamps",
            enrollments: "Diiwaangelintayda",
            applications: "Codsiyadayda",
            progress: "Horumarka Toddobaadlaha",
            member_hub: "Xarunta Xubnaha",
            main_sec: "Main",
            academy_sec: "Academy",
            tracking_sec: "Tracking",
            admin_sec: "Admin",
            instructor_sec: "Instructor"
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
          },
          stats: {
            students: "Ardayda Firfircoon",
            graduates: "Qalin-jebiyeyaasha",
            partners: "Wada-shaqeeyayaasha Caalamiga ah",
            rating: "Celcelis ahaan Qiimeynta"
          },
          bootcamps: {
            title: "Bootcamps-ka La Heli Karo",
            subtitle: "Dooro wadadaada oo bilow safarkaaga tababarka sare maanta.",
            enroll_now: "Hadda Isdiiwaangeli",
            no_bootcamps: "Lama helin bootcamps firfircoon.",
            view_all: "Eeg Dhammaan Barnaamijyada",
            show_less: "Muuji wax yar"
          },
          why: {
            title: "Waa maxay sababta CSEC",
            accent: "ASTU",
            subtitle: "Garaadka?",
            desc: "Annagu kaliya ma barayno koodhka; waxaan dhiseynaa jiilka xiga ee hoggaamiyeyaasha tignoolajiyada iyadoo loo marayo goobo takhasus leh.",
            dev_title: "Horumarinta (Development)",
            dev_desc: "Baro horumarinta full-stack ee casriga ah, injineernimada moobiilka, iyo qaabdhismeedka software-ka.",
            cpd_title: "CPD (Barnaamijyada Tartanka)",
            cpd_desc: "Sifee fikirkaaga algorithm iyo xalinta mashaakilaadka ee tartamada caalamiga ah.",
            cyber_title: "Amniga Cyber-ka",
            cyber_desc: "U quuso amniga weerarka, forensics dhijitaalka ah, iyo difaaca shabakada.",
            data_title: "Sayniska Xogta (Data Science)",
            data_desc: "Ka soo saar fikradaha xogta kakan oo dhis moodallo caqli leh adoo isticmaalaya barashada mashiinka."
          }
        }
      }
    }
  });

export default i18n;
