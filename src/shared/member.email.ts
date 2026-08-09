import { PUBLIC_CONFIG } from "../publicConfig";
import { sendMail } from "./send.email";

export async function sendLegacyMemberRequestEmail(firstName: string, lastName: string, email: string): Promise<boolean> {
    const text = [
        PUBLIC_CONFIG.EMAIL.GREETINGS("", "", "Divers"),
        `${firstName} ${lastName} hat das Mitgliederformular für manuelle Mitgliedschaften auf der Webseite ausgefüllt.`,
        `Bitte überprüfe ob ${firstName} ${lastName} den Mitgliederbeitrag überwiesen hat und bestätige es anschliessend auf der Verwaltungsseite.`,
        `Die E-Mail-Adresse von ${firstName} ${lastName} lautet: ${email}`,
        "-----------------------------------------------",
        `Dies ist eine automatisch verschickte E-Mail über eine API von mailjet.com\nProgrammiert und aufgesetzt von ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name}.\n${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name} ist nicht verantwortlich für eventuellen Spam oder andere Fehler, die durch den Endnutzer entstehen.\nBei Fragen oder Problemen, kontaktiere bitte den Entwickler unter ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email}.`,
        PUBLIC_CONFIG.EMAIL.REGARDS,
    ].join("\n\n");

    const html =
        PUBLIC_CONFIG.EMAIL.HEADER +
        [
            PUBLIC_CONFIG.EMAIL.GREETINGS_HTML(PUBLIC_CONFIG.EMAIL.GREETINGS("", "", "Divers")),
            `${firstName} ${lastName} hat das Mitgliederformular für manuelle Mitgliedschaften auf der Webseite ausgefüllt.`,
            `Bitte überprüfe ob ${firstName} ${lastName} den Mitgliederbeitrag überwiesen hat und bestätige es anschliessend auf der Verwaltungsseite.`,
            `Die E-Mail-Adresse von ${firstName} ${lastName} lautet: ${email}`,
            "-----------------------------------------------",
            `Dies ist eine automatisch verschickte E-Mail über eine API von mailjet.com<br>Programmiert und aufgesetzt von ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name}.<br>${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name} ist nicht verantwortlich für eventuellen Spam oder andere Fehler, die durch den Endnutzer entstehen.<br>Bei Fragen oder Problemen, kontaktiere bitte den Entwickler unter ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email}.`,
            PUBLIC_CONFIG.EMAIL.REGARDS_HTML,
        ].join("<br><br>") +
        PUBLIC_CONFIG.EMAIL.FOOTER;

    const request = await sendMail(PUBLIC_CONFIG.PERSONAS["CHAIRMAN"].email, `${firstName} ${lastName} will Mitglied werden`, text, html, "Legacy Membership Request");

    return request !== null && request.response.status === 200;
}
