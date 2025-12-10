import { PUBLIC_CONFIG } from "../publicConfig";
import { sendMail } from "./send.email";

export async function sendPasswordRecoveryConfirmationCode(code: string, email: string, firstName: string, lastName: string): Promise<boolean> {
    const text = [
        PUBLIC_CONFIG.EMAIL.GREETINGS(firstName, lastName, "Divers"),
        `Bitte bestätige deine Anfrage um dein Passwort zurückzusetzen. Dein Bestätigungscode lautet:`,
        code,
        "(Der Code ist 60 Minuten gültig.)",
        PUBLIC_CONFIG.EMAIL.REGARDS,
    ].join("\n\n");

    const html =
        PUBLIC_CONFIG.EMAIL.HEADER +
        [
            PUBLIC_CONFIG.EMAIL.GREETINGS_HTML(PUBLIC_CONFIG.EMAIL.GREETINGS(firstName, lastName, "Divers")),
            `Bitte bestätige deine Anfrage um dein Passwort zurückzusetzen. Dein Bestätigungscode lautet:`,
            code,
            "(Der Code ist 60 Minuten gültig.)",
            PUBLIC_CONFIG.EMAIL.REGARDS_HTML,
        ].join("<br><br>") +
        PUBLIC_CONFIG.EMAIL.FOOTER;

    const request = await sendMail(email, "Passwort zurücksetzten?", text, html, "Password Recovery Confirmation Code");

    return request !== null && request.response.status === 200;
}

export async function sendNewPassword(password: string, email: string, firstName: string, lastName: string): Promise<boolean> {
    const text = [
        PUBLIC_CONFIG.EMAIL.GREETINGS(firstName, lastName, "Divers"),
        `Deine Anfrage um dein Passwort zurückzusetzen wurde bestätigt. Dein neues Passwort lautet:`,
        password,
        "(Aus Sicherheitsgründen empfehlen wir, das Passwort nach dem ersten Login sofort unter 'Mein Account' zu ändern.)",
        PUBLIC_CONFIG.EMAIL.REGARDS,
    ].join("\n\n");

    const html =
        PUBLIC_CONFIG.EMAIL.HEADER +
        [
            PUBLIC_CONFIG.EMAIL.GREETINGS_HTML(PUBLIC_CONFIG.EMAIL.GREETINGS(firstName, lastName, "Divers")),
            `Deine Anfrage um dein Passwort zurückzusetzen wurde bestätigt. Dein neues Passwort lautet:`,
            password,
            "(Aus Sicherheitsgründen empfehlen wir, das Passwort nach dem ersten Login sofort unter 'Mein Account' zu ändern.)",
            PUBLIC_CONFIG.EMAIL.REGARDS_HTML,
        ].join("<br><br>") +
        PUBLIC_CONFIG.EMAIL.FOOTER;

    const request = await sendMail(email, "Neues Passwort", text, html, "New Password");

    return request !== null && request.response.status === 200;
}
