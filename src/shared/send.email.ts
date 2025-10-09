import Mailjet, { LibraryResponse } from "node-mailjet";
import { CONFIG } from "../config";
import { randomBytes } from "crypto";
import { RequestData } from "node-mailjet/declarations/request/Request";
import { MailjetAttachment } from "..";

const mailjet = new Mailjet({
    apiKey: CONFIG.MAILJET_PUBLIC_KEY,
    apiSecret: CONFIG.MAILJET_PRIVATE_KEY,
});

export async function sendMail(recipientEmail: string, subject: string, text: string, html: string, id: string = randomBytes(64).toString("hex"), files: MailjetAttachment[] = [], isTestMode = false): Promise<LibraryResponse<RequestData> | null> {
    try {
        const request = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: CONFIG.EMAIL_SENDER_ADDRESS,
                        Name: CONFIG.EMAIL_SENDER_NAME,
                    },
                    To: [
                        {
                            Email: recipientEmail,
                            Name: recipientEmail,
                        },
                    ],
                    Subject: subject,
                    TextPart: text,
                    HTMLPart: html,
                    CustomID: id,
                    Attachments: files,
                },
            ],
            SandboxMode: isTestMode,
        } as RequestData);

        return request;
    } catch (error) {
        console.error(error);

        return null;
    }
}
