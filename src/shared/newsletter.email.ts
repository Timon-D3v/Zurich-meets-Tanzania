import { CONFIG } from "../config";
import { PUBLIC_CONFIG } from "../publicConfig";
import { sendMail } from "./send.email";

export async function sendNewsletterSignUpConfirmation(email: string, id: string, firstName: string, lastName: string, gender: "Herr" | "Frau" | "Divers", timestamp: number): Promise<boolean> {
    const link = CONFIG.ORIGIN + `/newsletter/confirm?id=${id}&email=${email}&firstName=${firstName}&lastName=${lastName}&gender=${gender}&timestamp=${timestamp}`;

    const text = [PUBLIC_CONFIG.EMAIL.GREETINGS(firstName, lastName, gender), `Bitte bestätige deine Anmeldung für den Newsletter über diesen Link:\n${link}`, "(Der Link ist 60 Minuten gültig.)", PUBLIC_CONFIG.EMAIL.REGARDS].join("\n\n");

    const html = [PUBLIC_CONFIG.EMAIL.GREETINGS(firstName, lastName, gender), `Bitte bestätige deine Anmeldung für den Newsletter über diesen <a href="${link}" target="_blank">Link</a>.`, "(Der Link ist 60 Minuten gültig.)", PUBLIC_CONFIG.EMAIL.REGARDS].join("<br><br>");

    const request = await sendMail(email, "Anmeldebestätigung Newsletter", text, html, "Newsletter Anmeldung");

    return request !== null && request.response.status === 200;
}
