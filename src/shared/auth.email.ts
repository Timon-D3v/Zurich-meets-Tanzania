import { CONFIG } from "../config";
import { EMAIL_CONFIG } from "./email.config";
import { sendMail } from "./send.email";

/**
 * <Function>sendPasswordRecoveryConfirmationCode</Function>
 * 
 * Sends an email to a user containing a password recovery confirmation code.
 * The email includes a unique code that expires after approximately 60 minutes and links to the password recovery page.
 * Uses both plain text and HTML versions of the message with proper formatting.
 * 
 * @param {string} code - The one-time password recovery code generated on the server.
 * @param {string} email - The recipient's email address.
 * @param {string} firstName - The user's first name for personalized greeting.
 * @param {string} lastName - The user's last name for personalized greeting.
 * @returns {Promise<boolean>} Returns `true` if the email was sent successfully, `false` if sending failed (null request or rejected recipient). Logs errors to console.
 */
export async function sendPasswordRecoveryConfirmationCode(code: string, email: string, firstName: string, lastName: string): Promise<boolean> {
    const text = [
        EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers"),
        `Bitte bestätige deine Anfrage um dein Passwort zurückzusetzen. Dein Bestätigungscode lautet:`,
        code,
        `(Der Code ist etwa 60 Minuten gültig. Link zur Bestätigungsseite: ${CONFIG.ORIGIN}/password-recovery-confirm?email=${email})`,
        EMAIL_CONFIG.REGARDS,
    ].join("\n\n");

    const html =
        EMAIL_CONFIG.HEADER +
        [
            EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers")),
            `Bitte bestätige deine Anfrage um dein Passwort zurückzusetzen. Dein Bestätigungscode lautet:`,
            code,
            `(Der Code ist etwa 60 Minuten gültig. Link zur Bestätigungsseite: ${CONFIG.ORIGIN}/password-recovery-confirm?email=${email})`,
            EMAIL_CONFIG.REGARDS_HTML,
        ].join("<br><br>") +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(email, "Passwort zurücksetzten?", text, html, "Password Recovery Confirmation Code", await EMAIL_CONFIG.ATTACHMENTS());
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
 * <Function>sendNewPassword</Function>
 * 
 * Sends an email containing a newly generated password for account recovery.
 * The notification informs users to change the password immediately after first login
 * and provides a link to the account settings page. Includes security warning about changing password.
 * 
 * @param {string} password - The new password hash that was generated (should be hashed before this function call).
 * @param {string} email - The recipient's email address.
 * @param {string} firstName - The user's first name for personalized greeting.
 * @param {string} lastName - The user's last name for personalized greeting.
 * @returns {Promise<boolean>} Returns `true` if the email was sent successfully, `false` if sending failed. Logs errors to console on failure.
 */
export async function sendNewPassword(password: string, email: string, firstName: string, lastName: string): Promise<boolean> {
    const text = [
        EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers"),
        `Deine Anfrage um dein Passwort zurückzusetzen wurde bestätigt. Dein neues Passwort lautet:`,
        password,
        "(Aus Sicherheitsgründen empfehlen wir, das Passwort nach dem ersten Login sofort unter 'Mein Account' zu ändern.)",
        EMAIL_CONFIG.REGARDS,
    ].join("\n\n");

    const html =
        EMAIL_CONFIG.HEADER +
        [
            EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers")),
            `Deine Anfrage um dein Passwort zurückzusetzen wurde bestätigt. Dein neues Passwort lautet:`,
            password,
            "(Aus Sicherheitsgründen empfehlen wir, das Passwort nach dem ersten Login sofort unter 'Mein Account' zu ändern.)",
            EMAIL_CONFIG.REGARDS_HTML,
        ].join("<br><br>") +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(email, "Neues Passwort", text, html, "New Password", await EMAIL_CONFIG.ATTACHMENTS());
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
 * <Function>sendPasswordChangeConfirmation</Function>
 * 
 * Sends a notification email when a user has changed their password on the account page.
 * Informs users that they have successfully changed their password and warns them to change it
 * via account settings if they didn't initiate this change (possible security incident).
 * Includes recommendation to create a new password immediately after first login for security.
 * 
 * @param {string} password - The user's new hashed password (shown in the notification email).
 * @param {string} email - The recipient's email address.
 * @param {string} firstName - The user's first name for personalized greeting.
 * @param {string} lastName - The user's last name for personalized greeting.
 * @returns {Promise<boolean>} Returns `true` if the email was sent successfully, `false` if sending failed. Logs errors to console on failure.
 */
export async function sendPasswordChangeConfirmation(password: string, email: string, firstName: string, lastName: string): Promise<boolean> {
    const text = [
        EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers"),
        `Du hast gerade dein Passwort auf der Account-Seite geändert. Dein neues Passwort lautet:`,
        password,
        "(Falls du das nicht warst, empfehlen wir, das Passwort unter 'Mein Account' selbst zu ändern oder das Passwort zurückzusetzen.)",
        EMAIL_CONFIG.REGARDS,
    ].join("\n\n");

    const html =
        EMAIL_CONFIG.HEADER +
        [
            EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers")),
            `Du hast gerade dein Passwort auf der Account-Seite geändert. Dein neues Passwort lautet:`,
            password,
            "(Falls du das nicht warst, empfehlen wir, das Passwort unter 'Mein Account' selbst zu ändern oder das Passwort zurückzusetzen.)",
            EMAIL_CONFIG.REGARDS_HTML,
        ].join("<br><br>") +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(email, "Passwort geändert", text, html, "Password Change Confirmation", await EMAIL_CONFIG.ATTACHMENTS());
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
 * <Function>sendSignUpConfirmationCode</Function>
 * 
 * Sends an email containing a confirmation code for new account registration.
 * The code expires after approximately 60 minutes and includes a link to the signup confirmation page.
 * Part of the user onboarding process when someone creates a new membership account.
 * 
 * @param {string} code - The one-time confirmation code to display in the email.
 * @param {string} email - The recipient's email address (used for the confirmation link).
 * @param {string} firstName - The user's first name for personalized greeting.
 * @param {string} lastName - The user's last name for personalized greeting.
 * @returns {Promise<boolean>} Returns `true` if the email was sent successfully, `false` if sending failed. Logs errors to console on failure.
 */
export async function sendSignUpConfirmationCode(code: string, email: string, firstName: string, lastName: string): Promise<boolean> {
    const text = [
        EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers"),
        `Bitte bestätige deine Anfrage um deinen Account bei ZMT zu erstellen. Dein Bestätigungscode lautet:`,
        code,
        `(Der Code ist etwa 60 Minuten gültig. Link zur Bestätigungsseite: ${CONFIG.ORIGIN}/signup-confirm?email=${email})`,
        EMAIL_CONFIG.REGARDS,
    ].join("\n\n");

    const html =
        EMAIL_CONFIG.HEADER +
        [
            EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers")),
            `Bitte bestätige deine Anfrage um deinen Account bei ZMT zu erstellen. Dein Bestätigungscode lautet:`,
            code,
            `(Der Code ist etwa 60 Minuten gültig. Link zur Bestätigungsseite: ${CONFIG.ORIGIN}/signup-confirm?email=${email})`,
            EMAIL_CONFIG.REGARDS_HTML,
        ].join("<br><br>") +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(email, "Account erstellen?", text, html, "Signup Confirmation Code", await EMAIL_CONFIG.ATTACHMENTS());
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
 * <Function>sendPasswordFromAdmin</Function>
 * 
 * Sends an email with auto-generated password when an administrator creates an account for a user.
 * The notification informs the user that an account has been created specifically for them,
 * and recommends changing the password immediately after first login for security.
 * Includes contact information for administrators if the recipient didn't expect this email.
 * 
 * @param {string} password - The initially generated password (plain text to display in email).
 * @param {string} email - The recipient's email address.
 * @param {string} firstName - The user's first name for personalized greeting.
 * @param {string} lastName - The user's last name for personalized greeting.
 * @returns {Promise<boolean>} Returns `true` if the email was sent successfully, `false` if sending failed. Logs errors to console on failure.
 */
export async function sendPasswordFromAdmin(password: string, email: string, firstName: string, lastName: string): Promise<boolean> {
    const text = [
        EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers"),
        `Es wurde ein Account bei www.zurich-meets-tanzania.com für dich erstellt. Dein Passwort lautet:`,
        password,
        `Falls du das nicht wolltest, kontaktiere bitte einen Administrator unter ${CONFIG.ORIGIN}/contact \n(Aus Sicherheitsgründen empfehlen wir, das Passwort nach dem ersten Login sofort unter 'Mein Account' zu ändern.)`,
        EMAIL_CONFIG.REGARDS,
    ].join("\n\n");

    const html =
        EMAIL_CONFIG.HEADER +
        [
            EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS(firstName, lastName, "Divers")),
            `Es wurde ein Account bei Zurich meets Tanzania für dich erstellt. Dein Passwort lautet:`,
            password,
            `Falls du das nicht wolltest, kontaktiere bitte einen Administrator unter ${CONFIG.ORIGIN}/contact <br>(Aus Sicherheitsgründen empfehlen wir, das Passwort nach dem ersten Login sofort unter 'Mein Account' zu ändern.)`,
            EMAIL_CONFIG.REGARDS_HTML,
        ].join("<br><br>") +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(email, "Account erstellen?", text, html, "Signup Confirmation Code", await EMAIL_CONFIG.ATTACHMENTS());

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
