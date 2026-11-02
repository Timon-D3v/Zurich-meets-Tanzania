import { CONFIG } from "../config";
import { EMAIL_CONFIG } from "./email.config";
import { sendMail } from "./send.email";

/**
 * <Function>sendCriticalJobFailureNotification</Function>
 *
 * Sends an email to development team and administration about a critical background job failure.
 * Includes error details, retry attempt count (up to 5 attempts before abandoning), and current timestamp.
 * Only sends if running in production environment (`CONFIG.ENV !== "dev`); skips entirely in development mode.
 * Used after background jobs exceed `maxRetries` threshold for critical errors like Stripe webhook failures or file sync issues.
 * Emails sent configued to DEVELOPER and CHAIRMAN from PUBLIC_CONFIG.personas so admins can fix immediately.
 *
 * @param {string} fullName - The full name of the person to notify (typically developer or chairman).
 * @param {string} email - The email address of the recipient receiving this critical error notification.
 * @param {string} errorMessage - The detailed error message describing what job failed and why (includes retry logs).
 * @returns {Promise<boolean>} Returns `true` if the warning was sent successfully, or immediately in dev mode regardless of config checks. Returns `false` if sending email failed (null request) or if recipient rejected by SMTP server. Logs failures to console; throws critical error only after maxRetries limit exceeded and even emails fail.
 */
export async function sendCriticalJobFailureNotification(fullName: string, email: string, errorMessage: string): Promise<boolean> {
    if (CONFIG.ENV === "dev") {
        console.info("Development environment detected. Skipping sending critical job failure notification email.");
        return true;
    }

    const text = [
        EMAIL_CONFIG.GREETINGS(fullName, "", "Divers"),
        "Es gab einen kritischen Fehler bei der Ausführung eines Jobs. Bitte überprüfe die Logs für weitere Details:",
        errorMessage,
        "(Der Job wurde nach 5 Versuchen abgebrochen um " +
            new Date().toLocaleDateString("de-CH", {
                weekday: "short",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }) +
            ".)",
        EMAIL_CONFIG.REGARDS,
    ].join("\n\n");

    const html =
        EMAIL_CONFIG.HEADER +
        [
            EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS(fullName, "", "Divers")),
            "Es gab einen kritischen Fehler bei der Ausführung eines Jobs. Bitte überprüfe die Logs für weitere Details:",
            errorMessage,
            "(Der Job wurde nach 5 Versuchen abgebrochen um " +
                new Date().toLocaleDateString("de-CH", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                }) +
                ".)",
            EMAIL_CONFIG.REGARDS_HTML,
        ].join("<br><br>") +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(email, "Kritischer Fehler - Job fehlgeschlagen", text, html, "Critical Job Failure Notification", await EMAIL_CONFIG.ATTACHMENTS());

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
