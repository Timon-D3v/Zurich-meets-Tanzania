import { NewsContent, NewsletterUser } from "..";
import { CONFIG } from "../config";
import { PUBLIC_CONFIG } from "../publicConfig";
import { getAllNewsletterUsers } from "./newsletter.database";
import { sendMail } from "./send.email";
import { markdownToHtml } from "./utils";

export async function sendNewsletterSignUpConfirmation(email: string, id: string, firstName: string, lastName: string, gender: "Herr" | "Frau" | "Divers", timestamp: number): Promise<boolean> {
    const link = CONFIG.ORIGIN + `/newsletter/confirm?id=${id}&email=${email}&firstName=${firstName}&lastName=${lastName}&gender=${gender}&timestamp=${timestamp}`;

    const text = [PUBLIC_CONFIG.EMAIL.GREETINGS(firstName, lastName, gender), `Bitte bestätige deine Anmeldung für den Newsletter über diesen Link:\n${link}`, "(Der Link ist etwa 60 Minuten gültig.)", PUBLIC_CONFIG.EMAIL.REGARDS].join("\n\n");

    const html =
        PUBLIC_CONFIG.EMAIL.HEADER +
        [
            PUBLIC_CONFIG.EMAIL.GREETINGS_HTML(PUBLIC_CONFIG.EMAIL.GREETINGS(firstName, lastName, gender)),
            `Bitte bestätige deine Anmeldung für den Newsletter über diesen <a href="${link}" target="_blank">Link</a>.`,
            "(Der Link ist etwa 60 Minuten gültig.)",
            PUBLIC_CONFIG.EMAIL.REGARDS_HTML,
        ].join("<br><br>") +
        PUBLIC_CONFIG.EMAIL.FOOTER;

    const request = await sendMail(email, "Anmeldebestätigung Newsletter", text, html, "Newsletter Anmeldung");

    return request !== null && request.response.status === 200;
}

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
        const text = [PUBLIC_CONFIG.EMAIL.GREETINGS(recipient.firstName, recipient.lastName, recipient.gender), PUBLIC_CONFIG.EMAIL.NEWSLETTER_BODY(previewText), PUBLIC_CONFIG.EMAIL.REGARDS].join("\n\n");

        const html =
            PUBLIC_CONFIG.EMAIL.HEADER +
            [PUBLIC_CONFIG.EMAIL.GREETINGS_HTML(PUBLIC_CONFIG.EMAIL.GREETINGS(recipient.firstName, recipient.lastName, recipient.gender)), PUBLIC_CONFIG.EMAIL.NEWSLETTER_BODY_HTML(previewHtml), PUBLIC_CONFIG.EMAIL.REGARDS_HTML].join("<br><br>") +
            PUBLIC_CONFIG.EMAIL.FOOTER;

        const request = await sendMail(recipient.email, PUBLIC_CONFIG.EMAIL.NEWSLETTER_SUBJECT, text, html, "Newsletter");

        if (request === null || request.response.status !== 200) {
            console.error(`Failed to send newsletter to ${recipient.email}:`, request?.response.statusText || "Unknown error");
        }
    }

    return true;
}
