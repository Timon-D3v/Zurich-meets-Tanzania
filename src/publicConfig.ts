import { PublicConfig } from ".";

export const PUBLIC_CONFIG: PublicConfig = {
    NAME: "zurich meets tanzania",
    ORIGIN: "http://localhost:8080",

    THEME_COLOR: "#F27C0D",

    UNIKAT_URL: "https://shop.unikat-hoengg.ch/produkte/zurichmeetstanzania-60?d=1",
    FACEBOOK_URL: "https://www.facebook.com/profile.php?id=61577621371823",
    INSTAGRAM_URL: "https://www.instagram.com/zurichmeetstanzania/",
    PROGRAMMER_URL: "https://www.timondev.com/",

    PERSONAS: {
        CHAIRMAN: {
            name: "Dr. Stefan Christen",
            email: "info@zurich-meets-tanzania.com",
        },
        SECRETARY: {
            name: "Sara Pieretti",
            email: "info@zurich-meets-tanzania.com",
        },
        DEVELOPER: {
            name: "Timon Fiedler",
            email: "info@timondev.com",
            website: "https://www.timondev.com",
            linkedIn: "https://www.linkedin.com/in/timon-fiedler",
            github: "https://github.com/Timon-D3v/",
        },
    },

    ERROR: {
        INTERNAL_ERROR: "501: Internal Server Error",
        NO_CONNECTION_TO_DATABASE: "Es konnte keine Verbindung mit der Datenbank hergestellt werden. Bitte versuche es später noch einmal.",
        NO_INTERNET_CONNECTION: "Es konnte keine Verbindung zum Internet hergestellt werden. Bitte versuche es später noch einmal.",
        NO_CONNECTION_TO_SERVER: "Es konnte keine Verbindung mit dem Server hergestellt werden. Bitte versuche es später noch einmal.",
        BAD_REQUEST: "Die Anfrage konnte nicht verarbeitet werden, da falsche oder unvollständig Angaben geschickt wurden. Bitte überprüfe deine Daten und versuche es später noch einmal.",
    },

    ROUTES: {
        TYPES: {
            HOME: ["/home", "/"],
            AUTH: ["/login", "/signup", "/password-recovery"],
            SECURED: ["/account"],
            PROJECTS: ["/bajaji", "/cardiology", "/gynecology", "/mbuzi", "/meducation", "/surgery", "/tanzania-meets-zurich", "/zurich-meets-tanzania"],
            ADMIN: ["/admin"],
            CONTACT: ["/contact"],
            GENERAL: [
                "/",
                "/archive",
                "/beginning",
                "/blog",
                "/current-team",
                "/donate",
                "/executives",
                "/finances",
                "/gallery",
                "/general-meeting",
                "/history-tanzania",
                "/imprint",
                "/income-statement",
                "/membership",
                "/newsletter-sign-out",
                "/privacy",
                "/statutes",
                "/vision",
            ],
        },
        TITLES: {
            "/": {
                title: "Home",
                description:
                    "Wir sind ein Team von medizinischen Fachleuten aus den verschiedensten Berufsgruppen und Lehren. Eine bunt zusammengemischte Truppe engagierter, hilfsbereiter Leute. Erfahre auf dieser Seite mehr über unser Team, unsere Freunde in Mbalizi und unsere Partner.",
                lastUpdated: "Fri Aug 15 2025 16:33:30 GMT+0200 (Mitteleuropäische Sommerzeit)",
            },
        },
    },

    EMAIL: {
        GREETINGS: (fistName: string, lastName: string, gender: "Herr" | "Frau" | "Divers"): string => {
            switch (gender) {
                case "Herr":
                    return `Lieber Herr ${lastName}`;
                    break;
                case "Frau":
                    return `Liebe Frau ${lastName}`;
                    break;
                default:
                    return `Guten Tag ${fistName} ${lastName}`;
                    break;
            }
        },
        GREETINGS_HTML: (greetings: string): string => `<p style="
            font-size: 18px; 
            color: #070d13; 
            font-family: 'Titillium Web', Helvetica, Arial, sans-serif; 
            display: block;
            margin-block-start: 0; 
            margin-block-end: 0; 
            margin-inline-start: 0; 
            margin-inline-end: 0; 
            margin: 1em 0; 
            word-wrap: normal; 
            word-break: keep-all; 
            -webkit-hyphens: auto;
            hyphens: auto; ">
                ${greetings}    
            </p>`,
        REGARDS: "\n\nMit freundlichen Grüssen\nzurich meets tanzania",
        REGARDS_HTML: `<p style="
            font-size: 18px; 
            color: #070d13; 
            font-family: 'Titillium Web', Helvetica, Arial, sans-serif; 
            display: block; 
            margin-block-start: 0; 
            margin-block-end: 0; 
            margin-inline-start: 0; 
            margin-inline-end: 0; 
            margin: 1em 0; 
            word-wrap: normal; 
            word-break: keep-all; 
            -webkit-hyphens: auto;
            hyphens: auto;">
                    Mit freundlichen Grüssen
                    <br>
                    <strong style="
                        font-size: 18px; 
                        color: #070d13; 
                        font-family: 'Titillium Web', Helvetica, Arial, sans-serif; 
                        font-weight: bold;">
                            zurich meets tanzania
                    </strong>
                </p>`,
        HEADER: `<div style="display: block; overflow-x: auto;">
                <table align="center" style="width: 100%; background-color: #fff5e5;">
                    <td style="display: block; min-height: 100px; margin-bottom: 20px;">
                        <table align="right">
                            <tbody>
                                <tr>
                                    <td>
                                        <a style="
                                            text-decoration: none; 
                                            cursor: pointer; 
                                            height: 100px; 
                                            color: #070d13; 
                                            font-family: 'Titillium Web', Helvetica, Arial, sans-serif;" 
                                            
                                            href="https://zurich-meets-tanzania.com"
                                        >
                                            <img style="height: 90px; padding: 5px; margin: 0 5px;" alt="Banner" src="https://ik.imagekit.io/zmt/email%20files/logo.png">
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td style="width: 100%; display: block;">
                        <table align="center" style="background-color: #fff5e5;">
                            <tbody>
                                <tr>
                                    <td>
                                        <div style="display: block; max-width: 640px; min-width: 250px; background-color: #ffebcc; padding: 25px;">`,
        FOOTER: `                       </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td style="display: block; width: 100%; min-height: 50px; padding-top: 20px;">
                            <table align="center">
                                <tbody>
                                    <tr>
                                        <td style="text-align: center;">
                                            <a style="
                                                font-size: 18px; 
                                                margin-right: 20px; 
                                                line-height: 1.5; 
                                                color: #070d13; 
                                                font-family: 'Titillium Web', Helvetica, Arial, sans-serif; 
                                                cursor: pointer; 
                                                text-decoration: underline;" 
                                                
                                                href="https://zurich-meets-tanzania.com/#scroll_to_news"
                                            >
                                                Aktuelles
                                            </a>
                                            <a style="
                                                font-size: 18px; 
                                                margin-right: 20px; 
                                                line-height: 1.5; 
                                                color: #070d13; font-family: 'Titillium Web', Helvetica, Arial, sans-serif; 
                                                cursor: pointer; 
                                                text-decoration: underline;" 
                                                
                                                href="https://zurich-meets-tanzania.com"
                                            >
                                                Homepage
                                            </a>
                                            <a style="
                                                font-size: 18px; 
                                                line-height: 1.5; 
                                                color: #070d13; 
                                                font-family: 'Titillium Web', Helvetica, Arial, sans-serif; 
                                                cursor: pointer; 
                                                text-decoration: underline;" 
                                                
                                                href="https://zurich-meets-tanzania.com/newsletter/abmelden"
                                            >
                                                Abmelden
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table align="center" style="padding: 20px 0;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <a style="
                                                display: block; 
                                                height: 30px; 
                                                width: 30px; 
                                                cursor: pointer; 
                                                margin-right: 20px; 
                                                text-decoration: none; 
                                                color: #070d13; 
                                                font-family: 'Titillium Web', Helvetica, Arial, sans-serif;" 
                                                
                                                href="https://www.instagram.com/zurichmeetstanzania/"
                                            >
                                                <img style="
                                                    height: 30px; 
                                                    width: 30px; 
                                                    overflow: clip; 
                                                    overflow-clip-margin: content-box;" 
                                                    
                                                    alt="Instagram Link" 
                                                    src="https://ik.imagekit.io/zmt/email%20files/instgram.png"
                                                >
                                            </a>
                                        </td>
                                        <td>
                                            <a style="
                                                display: block; 
                                                height: 30px; 
                                                width: 30px; 
                                                cursor: pointer; 
                                                text-decoration: none; 
                                                margin-right: 20px; 
                                                color: #070d13; 
                                                font-family: 'Titillium Web', Helvetica, Arial, sans-serif;" 
                                                
                                                href="https://www.facebook.com/profile.php?id=100064463715451"
                                            >
                                                <img style="
                                                    height: 30px; 
                                                    width: 30px; 
                                                    overflow: clip; 
                                                    overflow-clip-margin: content-box;" 
                                                    
                                                    alt="Facebook Link" 
                                                    src="https://ik.imagekit.io/zmt/email%20files/facebook.png"
                                                >
                                            </a>
                                        </td>
                                        <td>
                                            <a style="
                                                display: block; 
                                                height: 30px; 
                                                width: 30px; 
                                                cursor: pointer; 
                                                text-decoration: none; 
                                                color: #070d13; 
                                                font-family: 'Titillium Web', Helvetica, Arial, sans-serif;" 
                                                
                                                href="https://www.timondev.com"
                                            >
                                                <img style="
                                                    height: 30px; 
                                                    width: 30px; 
                                                    border-radius: 5px; 
                                                    overflow: clip; 
                                                    overflow-clip-margin: content-box;" 
                                                    
                                                    src="https://ik.imagekit.io/timon/cdn/icon" 
                                                    alt="Logo des Entwicklers"
                                                >
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </table>
                </div>`,
        NEWSLETTER_BODY: (preview: string): string =>
            "\nWir freuen uns Ihnen mitteilen zu können, dass wir Neuigkeiten haben.\nSie können sie sich gerne unter folgendem Link anschauen: https://zurich-meets-tanzania.com/#scroll_to_news\n\nHier ist schon eine kleine Vorschau:\n" + preview,
        NEWSLETTER_BODY_HTML: (preview: string): string => `<p style="
                            font-size: 16px; 
                            color: #070d13; 
                            font-family: 'Titillium Web', Helvetica, Arial, sans-serif; 
                            display: block; 
                            margin-block-start: 0; 
                            margin-block-end: 0; 
                            margin-inline-start: 0; 
                            margin-inline-end: 0; 
                            margin: 1em 0; 
                            word-wrap: normal; 
                            word-break: keep-all;
                            -webkit-hyphens: auto; 
                            hyphens: auto; "
                        >
                            Wir freuen uns Ihnen mitteilen zu können, dass wir Neuigkeiten haben. 
                            Sie können sie sich gerne unter folgendem 
                            <a style="
                                color: #c2630a; 
                                text-decoration: underline; 
                                cursor: pointer; 
                                font-size: 16px; 
                                font-family: 'Titillium Web', Helvetica, Arial, sans-serif; 
                                display: inline; 
                                word-wrap: normal; 
                                word-break: keep-all;
                                -webkit-hyphens: auto; 
                                hyphens: auto;" 
                                
                                href="https://zurich-meets-tanzania.com/#scroll_to_news"
                            >
                                Link
                            </a>
                            anschauen.
                            <br>
                            <br>
                            Hier ist schon eine kleine Vorschau:
                            <br>
                            ${preview.replaceAll(/\n/, "<br>")}
                        </p>`,
        NEWSLETTER_SUBJECT: "Es gibt Neuigkeiten!",
    },
};
