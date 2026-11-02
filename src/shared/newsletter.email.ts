import { NewsContent, NewsletterUser } from "..";
import { CONFIG } from "../config";
import { EMAIL_CONFIG } from "./email.config";
import { getAllNewsletterUsers } from "./newsletter.database";
import { sendMail } from "./send.email";
import { markdownToHtml } from "./utils";

/**
 * <Function>sendNewsletterSignUpConfirmation</Function>
 * 
 * Sends email confirmation to new newsletter subscribers upon signing up for notifications.
 * Includes signup confirmation link with time-limited validation token (id and timestamp) for security.
 * Link expires after approximately 60 minutes to prevent replay attacks or unauthorized subscriptions.
 * Email displays recipient's name, gender selection, and prominent confirmation URL instructions.
 * Used during newsletter subscription onboarding process when user opts into receiving news updates.
 * 
 * @param {string} email - The subscriber's email address for delivering the confirmation notice.
 * @param {string} id - Unique signup token identifying this newsletter subscription attempt (part of link URL).
 * @param {string} firstName - The first name of the person signing up for the newsletter greeting.
 * @param {string} lastName - The last name of the newsletter subscriber for personalized greeting.
 * @param {"Herr"|"Frau"|"Divers"} gender - Gender/identity selection from form options (German: Herr, Frau, or Divers).
 * @param {number} timestamp - Unix timestamp when signup occurred to generate time-limited confirmation link validity window.
 * @returns {Promise<boolean>} Returns `true` if the signup confirmation email was sent successfully, `false` if sending failed. Logs errors to console on failure. Throws no explicit errors.
 */
export async function sendNewsletterSignUpConfirmation(email: string, id: string, firstName: string, lastName: string, gender: "Herr" | "Frau" | "Divers", timestamp: number): Promise<boolean> {
    const link = CONFIG.ORIGIN + `/newsletter/confirm?id=${id}&email=${email}&firstName=${firstName}&lastName=${lastName}&gender=${gender}&timestamp=${timestamp}`;

    const text = [EMAIL_CONFIG.GREETINGS(firstName, lastName, gender), `Bitte bestätige deine Anmeldung für den Newsletter über diesen Link:\n${link}`, "(Der Link ist etwa 60 Minuten gültig.)", EMAIL_CONFIG.REGARDS].join("\n\n");

    const html =
        EMAIL_CONFIG.HEADER +
        [
            EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS(firstName, lastName, gender)),
            `Bitte bestätige deine Anmeldung für den Newsletter über diesen <a href="${link}" target="_blank">Link</a>.`,
            "(Der Link ist etwa 60 Minuten gültig.)",
            EMAIL_CONFIG.REGARDS_HTML,
        ].join("<br><br>") +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(email, "Anmeldebestätigung Newsletter", text, html, "Newsletter Anmeldung", await EMAIL_CONFIG.ATTACHMENTS());

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
 * <Function>sendNewsletterSignOutConfirmation</Function>
 * 
 * Sends confirmation email including unique sign-out code for removing subscribers from newsletter distribution list.
 * Used when a subscriber wishes to unsubscribe or opt out of future newsletters while potentially keeping contact data.
 * Code is time-limited (approximately 60 minutes) and single-use by design pattern. Email displays greeting with unsubscribe instructions.
 * 
 * @param {string} email - The unsubscribing subscriber's email address for delivering the confirmation notice.
 * @param {string} code - Unique sign-out verification code to validate this unsubscribe request (prevents unauthorized removals).
 * @param {string} firstName - The first name of the person unsubscribing from newsletter for personalized greeting.
 * @param {string} lastName - The last name of the newsletter subscriber for personalized greeting.
 * @param {"Herr"|"Frau"|"Divers"} gender - Gender/identity selection from form options (German: Herr, Frau, or Divers).
 * @returns {Promise<boolean>} Returns `true` if the sign-out confirmation email was sent successfully, `false` if sending failed. Logs errors to console on failure. Throws no explicit errors.
 */
export async function sendNewsletterSignOutConfirmation(email: string, code: string, firstName: string, lastName: string, gender: "Herr" | "Frau" | "Divers"): Promise<boolean> {
    const text = [EMAIL_CONFIG.GREETINGS(firstName, lastName, gender), "Dein Bestätigungscode zum Abmelden von unserem Newsletter lautet:", code, "(Der Code ist etwa 60 Minuten gültig.)", EMAIL_CONFIG.REGARDS].join("\n\n");

    const html =
        EMAIL_CONFIG.HEADER +
        [EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS(firstName, lastName, gender)), "BDein Bestätigungscode zum Abmelden von unserem Newsletter lautet:", code, "(Der Code ist etwa 60 Minuten gültig.)", EMAIL_CONFIG.REGARDS_HTML].join(
            "<br><br>",
        ) +
        EMAIL_CONFIG.FOOTER;

    const request = await sendMail(email, "Vom Newsletter Abmelden", text, html, "Newsletter Abmeldung", await EMAIL_CONFIG.ATTACHMENTS());

    if (request === null) {
        console.error(`Failed to send newsletter to ${email}:`, "Request returned null");

        return false;
    }

    if (request !== null && request.rejected.length > 0) {
        console.error(`Failed to send newsletter to ${email}:`, "Recipient was rejected by the SMTP server");

        return false;
    }

    return true;
}

/**
 * <Function>sendNewsletterForNews</Function>
 * 
 * Sends a newsletter to all subscribed users containing latest news articles converted to email format.
 * Fetches newsletter recipients from getAllNewsletterUsers, iterates through each subscriber's contact information,
 * and sends personalized emails with HTML greeting using recipient's name and gender selection. Content array can include title, subtitle, paragraph elements with markdown body text.
 * Handles individualized content preview generation per section of news article. Logs email delivery failures per recipient but returns true if overall process completes (even if some recipients failed).
 * Used for distributing regular newsletter updates to opted-in communication list after news is published.
 * 
 * @param {NewsContent} newsContent - An object containing the complete newsletter content array with elements of type "title", "subtitle", and "paragraph" holding body markdown text.
 * @returns {Promise<boolean>} Returns `true` if the newsletter distribution process completed, logging errors for any failed recipients. Logs console output on failures or errors during database queries. Throws no explicit errors.
 */
export async function sendNewsletterForNews(newsContent: NewsContent): Promise<boolean> {
    const recipientsResult = await getAllNewsletterUsers();

    if (recipientsResult.error !== null) {
        console.error("Failed to retrieve newsletter recipients:", recipientsResult.error);

        return false;
    }

    const recipients = recipientsResult.data as NewsletterUser[];

    let previewText = "";
    let previewHtml = "";

    for (const element of newsContent.content) {
        if (element.type === "title") {
            previewText += element.content + "\n\n";
            previewHtml += `<u><b>${element.content}</b></u><br><br>`;
        } else if (element.type === "subtitle") {
            previewText += element.content + "\n";
            previewHtml += `<b>${element.content}</b><br>`;
        } else if (element.type === "paragraph") {
            previewText += element.content + "\n\n";
            previewHtml += `${markdownToHtml(element.content)}<br><br>`;
        }
    }

    for (const recipient of recipients) {
        const text = [EMAIL_CONFIG.GREETINGS(recipient.firstName, recipient.lastName, recipient.gender), EMAIL_CONFIG.NEWSLETTER_BODY(previewText), EMAIL_CONFIG.REGARDS].join("\n\n");

        const html =
            EMAIL_CONFIG.HEADER +
            [EMAIL_CONFIG.GREETINGS_HTML(EMAIL_CONFIG.GREETINGS(recipient.firstName, recipient.lastName, recipient.gender)), EMAIL_CONFIG.NEWSLETTER_BODY_HTML(previewHtml), EMAIL_CONFIG.REGARDS_HTML].join("<br><br>") +
            EMAIL_CONFIG.FOOTER;

        const request = await sendMail(recipient.email, EMAIL_CONFIG.NEWSLETTER_SUBJECT, text, html, "Newsletter", await EMAIL_CONFIG.ATTACHMENTS());

        if (request === null) {
            console.error(`Failed to send newsletter to ${recipient.email}:`, "Request returned null");
        }

        if (request !== null && request.rejected.length > 0) {
            console.error(`Failed to send newsletter to ${recipient.email}:`, "Recipient was rejected by the SMTP server");
        }
    }

    return true;
}
