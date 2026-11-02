import { CONFIG } from "../config";
import { PUBLIC_CONFIG } from "../publicConfig";
import { EMAIL_CONFIG } from "./email.config";
import { sendMail } from "./send.email";

/**
 * <Function>sendContactRequestConfirmation</Function>
 *
 * Sends a confirmation email to a user who submitted a contact form request.
 * The email contains a one-time verification code that expires after 60 minutes for security.
 * Uses HTML and plain text formats with proper EMAIL_CONFIG templates, logos, and signature.
 * Part of the contact form submission flow before forwarding notification to recipients.
 *
 * @param {string} firstName - The first name of the person who will receive this email (for personalized greeting).
 * @param {string} lastName - The last name of the person who will receive this email (for personalized greeting).
 * @param {string} email - The recipient's verified email address that submitted the contact form.
 * @param {string} verificationCode - The unique one-time code sent to confirm the sender's intent.
 * @returns {Promise<boolean>} Returns `true` if the confirmation email was sent successfully, `false` if sending failed (null request or rejected recipient). Logs errors to console.
 */
export async function sendContactRequestConfirmation(firstName: string, lastName: string, email: string, verificationCode: string): Promise<boolean> {
    const text = [
        EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers"),
        "Bitte bestätige deine Kontaktanfrage von unserer Webseite. Dein Bestätigungscode lautet:",
        verificationCode,
        "(Der Code ist etwa 60 Minuten gültig.)",
        EMAIL_CONFIG.REGARDS,
    ].join("\n\n");

    const html =
        EMAIL_CONFIG.HEADER +
        [
            EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers")),
            "Bitte bestätige deine Kontaktanfrage von unserer Webseite. Dein Bestätigungscode lautet:",
            verificationCode,
            "(Der Code ist etwa 60 Minuten gültig.)",
            EMAIL_CONFIG.REGARDS_HTML,
        ].join("<br><br>") +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(email, "Kontaktformular-Bestätigung", text, html, "Contact Confirmation Code", await EMAIL_CONFIG.ATTACHMENTS());

    if (request === null) {
        console.error(`Failed to send email to ${email}:`, "Request returned null");

        return false;
    }

    if (request !== null && request.rejected.length > 0) {
        console.error(`Failed to send email to ${email}:`, "Recipient was rejected by the SMTP server");

        return false;
    }

    return true;
}

/**
 * <Function>sendContactRequest</Function>
 *
 * Sends a notification email to the owner/admin about a new contact form submission.
 * The message includes sender details (name, email), the full message content, timestamp, and sender information.
 * Includes disclaimer that this is an automated email from developer API; do not reply.
 * Uses EMAIL_CONFIG templates with proper logos, signature, and footer formatting.
 *
 * @param {string} userEmail - The email address of the person who submitted the contact form.
 * @param {string} userFirstName - The first name of the person who submitted the form (for greeting).
 * @param {string} userLastName - The last name of the person who submitted the form (for greeting).
 * @param {string} message - The full message content typed by the form sender.
 * @returns {Promise<boolean>} Returns `true` if the message was sent successfully, `false` if sending failed. Logs errors to console.
 */
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
        EMAIL_CONFIG.HEADER +
        [
            EMAIL_CONFIG.GREETINGS_HTML(`${userFirstName} ${userLastName} schreibt:`),
            "----------------------------------------------",
            message,
            "----------------------------------------------",
            `${userFirstName} ${userLastName} hat die Nachricht am ${date} um ${time} über das Kontaktformular auf der Webseite gesendet.\nDu kannst ${userFirstName} ${userLastName} unter der E-Mail-Adresse ${userEmail} erreichen.`,
            "----------------------------------------------",
            `Dies ist eine automatisch verschickte E-Mail über eine API von mailjet.com Programmiert und aufgesetzt von ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name}. Bitte antworte nicht direkt auf diese Nachricht.\n${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name} ist nicht verantwortlich für eventuellen Spam oder andere Fehler, die durch den Endnutzer entstehen.\nBei Fragen oder Problemen kannst du dich unter ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email} melden.`,
        ].join("<br><br>") +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(CONFIG.EMAIL_SENDER_ADDRESS, `${userFirstName} schreibt über Kontaktformular`, text, html, "Contact Request", await EMAIL_CONFIG.ATTACHMENTS());

    if (request === null) {
        console.error(`Failed to send email to ${userEmail}:`, "Request returned null");

        return false;
    }

    if (request !== null && request.rejected.length > 0) {
        console.error(`Failed to send email to ${userEmail}:`, "Recipient was rejected by the SMTP server");

        return false;
    }

    return true;
}
