import { CONFIG } from "../config";
import { PUBLIC_CONFIG } from "../publicConfig";
import { sendMail } from "./send.email";

export async function sendContactRequestConfirmation(firstName: string, lastName: string, email: string, verificationCode: string): Promise<boolean> {
    const text = [
        PUBLIC_CONFIG.EMAIL.GREETINGS(firstName, lastName, "Divers"),
        "Bitte bestätige deine Kontaktanfrage von unserer Webseite. Dein Bestätigungscode lautet:",
        verificationCode,
        "(Der Code ist etwa 60 Minuten gültig.)",
        PUBLIC_CONFIG.EMAIL.REGARDS,
    ].join("\n\n");

    const html =
        PUBLIC_CONFIG.EMAIL.HEADER +
        [
            PUBLIC_CONFIG.EMAIL.GREETINGS_HTML(PUBLIC_CONFIG.EMAIL.GREETINGS(firstName, lastName, "Divers")),
            "Bitte bestätige deine Kontaktanfrage von unserer Webseite. Dein Bestätigungscode lautet:",
            verificationCode,
            "(Der Code ist etwa 60 Minuten gültig.)",
            PUBLIC_CONFIG.EMAIL.REGARDS_HTML,
        ].join("<br><br>") +
        PUBLIC_CONFIG.EMAIL.FOOTER;

    const request = await sendMail(email, "Kontaktformular-Bestätigung", text, html, "Contact Confirmation Code");

    return request !== null && request.response.status === 200;
}

export async function sendContactRequest(userEmail: string, userFirstName: string, userLastName: string, message: string): Promise<boolean> {
    const date = new Date().toLocaleDateString("ch-DE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
    });
    const time = new Date().toLocaleTimeString("ch-DE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const text = [
        `${userFirstName} ${userLastName} schreibt:`,
        "----------------------------------------------",
        message,
        "----------------------------------------------",
        `${userFirstName} ${userLastName} hat die Nachricht am ${date} um ${time} über das Kontaktformular auf der Webseite gesendet.\nDu kannst ${userFirstName} ${userLastName} unter der E-Mail-Adresse ${userEmail} erreichen.`,
        "----------------------------------------------",
        `Dies ist eine automatisch verschickte E-Mail über eine API von mailjet.com Programmiert und aufgesetzt von ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name}. Bitte antworte nicht direkt auf diese Nachricht.\n${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name} ist nicht verantwortlich für eventuellen Spam oder andere Fehler, die durch den Endnutzer entstehen.\nBei Fragen oder Problemen kannst du dich unter ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email} melden.`,
    ].join("\n\n");

    const html =
        PUBLIC_CONFIG.EMAIL.HEADER +
        [
            PUBLIC_CONFIG.EMAIL.GREETINGS_HTML(`${userFirstName} ${userLastName} schreibt:`),
            "----------------------------------------------",
            message,
            "----------------------------------------------",
            `${userFirstName} ${userLastName} hat die Nachricht am ${date} um ${time} über das Kontaktformular auf der Webseite gesendet.\nDu kannst ${userFirstName} ${userLastName} unter der E-Mail-Adresse ${userEmail} erreichen.`,
            "----------------------------------------------",
            `Dies ist eine automatisch verschickte E-Mail über eine API von mailjet.com Programmiert und aufgesetzt von ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name}. Bitte antworte nicht direkt auf diese Nachricht.\n${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name} ist nicht verantwortlich für eventuellen Spam oder andere Fehler, die durch den Endnutzer entstehen.\nBei Fragen oder Problemen kannst du dich unter ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email} melden.`,
        ].join("<br><br>") +
        PUBLIC_CONFIG.EMAIL.FOOTER;

    const request = await sendMail(CONFIG.EMAIL_SENDER_ADDRESS, `${userFirstName} schreibt über Kontaktformular`, text, html, "Contact Request");

    return request !== null && request.response.status === 200;
}
