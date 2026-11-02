import { PUBLIC_CONFIG } from "../publicConfig";
import { EMAIL_CONFIG } from "./email.config";
import { sendMail } from "./send.email";

/**
 * <Function>sendDonationRequestEmail</Function>
 *
 * Sends a notification email to the chairman/admin about a new donation submission.
 * The email includes donor name, amount donated (in CHF), specified usage type (purpose), and donor email address.
 * Uses EMAIL_CONFIG templates with proper logos, headers, and developer disclaimer footer.
 * Part of the donation intake workflow for admin approval/rejection processes.
 *
 * @param {number} amount - The donation amount in Swiss Francs (CHF).
 * @param {string} firstName - The donor's first name who submitted this donation.
 * @param {string} lastName - The donor's last name who submitted this donation.
 * @param {string} email - The donor's contact email address as provided in the donation form.
 * @param {string} usageType - The designated purpose/category for where this donation should be spent.
 * @returns {Promise<boolean>} Returns `true` if the notification was sent successfully, `false` if sending failed (null request or rejected recipient). Logs errors to console.
 */
export async function sendDonationRequestEmail(amount: number, firstName: string, lastName: string, email: string, usageType: string): Promise<boolean> {
    const text = [
        EMAIL_CONFIG.GREETINGS("", "", "Divers"),
        `${firstName} ${lastName} hat via dem Spendenformular auf der Webseite ${amount}chf gespendet.`,
        `Der angegebene Verwendungszweck ist: ${usageType}`,
        `Die E-Mail-Adresse des Spenders lautet: ${email}`,
        "-----------------------------------------------",
        `Dies ist eine automatisch verschickte E-Mail über eine API von mailjet.com\nProgrammiert und aufgesetzt von ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name}.\n${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name} ist nicht verantwortlich für eventuellen Spam oder andere Fehler, die durch den Endnutzer entstehen.\nBei Fragen oder Problemen, kontaktiere bitte den Entwickler unter ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email}.`,
        EMAIL_CONFIG.REGARDS,
    ].join("\n\n");

    const html =
        EMAIL_CONFIG.HEADER +
        [
            EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS("", "", "Divers")),
            `${firstName} ${lastName} hat via dem Spendenformular auf der Webseite ${amount}chf gespendet.`,
            `Der angegebene Verwendungszweck ist: ${usageType}`,
            `Die E-Mail-Adresse des Spenders lautet: ${email}`,
            "-----------------------------------------------",
            `Dies ist eine automatisch verschickte E-Mail über eine API von mailjet.com<br>Programmiert und aufgesetzt von ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name}.<br>${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name} ist nicht verantwortlich für eventuellen Spam oder andere Fehler, die durch den Endnutzer entstehen.<br>Bei Fragen oder Problemen, kontaktiere bitte den Entwickler unter ${PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email}.`,
            EMAIL_CONFIG.REGARDS_HTML,
        ].join("<br><br>") +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(PUBLIC_CONFIG.PERSONAS["CHAIRMAN"].email, `${firstName} ${lastName} hat gespendet`, text, html, "Donation Request", await EMAIL_CONFIG.ATTACHMENTS());

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
