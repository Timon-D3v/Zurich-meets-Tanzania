import { PublicConfig } from ".";

export const PUBLIC_CONFIG: PublicConfig = {
    UNIKAT_URL: "https://shop.unikat-hoengg.ch/produkte/zurichmeetstanzania-60?d=1",
    FACEBOOK_URL: "https://www.facebook.com/profile.php?id=61577621371823",
    INSTAGRAM_URL: "https://www.instagram.com/zurichmeetstanzania/",
    PROGRAMMER_URL: "https://www.timondev.com/",

    ERROR: {
        NO_CONNECTION_TO_DATABASE: "Es konnte keine Verbindung mit der Datenbank hergestellt werden. Bitte versuche es später noch einmal.",
    },

    ROUTES: {
        TYPES: {
            AUTH: ["/login", "/signup", "/password-recovery"],
            SECURED: ["/account"],
            PROJECTS: ["/bajaji", "/cardiology", "/gynecology", "/mbuzi", "/meducation", "/surgery", "/tanzania-meets-zurich", "/zurich-meets-tanzania"],
            ADMIN: ["/admin"],
            CONTACT: ["/contact"],
            GENERAL: ["/", "/archive", "/beginning", "/blog", "/current-team", "/donate", "/executives", "/finances", "/gallery", "/general-meeting", "/history-tanzania", "/imprint", "/income-statement", "/membership", "/newsletter-sign-out", "/privacy", "/statutes", "/vision"],
        },
        TITLES: {
            "/": {
                title: "Home",
                description: "Wir sind ein Team von medizinischen Fachleuten aus den verschiedensten Berufsgruppen und Lehren. Eine bunt zusammengemischte Truppe engagierter, hilfsbereiter Leute. Erfahre auf dieser Seite mehr über unser Team, unsere Freunde in Mbalizi und unsere Partner.",
                lastUpdated: "Fri Aug 15 2025 16:33:30 GMT+0200 (Mitteleuropäische Sommerzeit)",
            },
        },
    },
};
