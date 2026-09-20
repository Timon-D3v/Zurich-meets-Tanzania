import nodemailer, { SMTPSentMessageInfo, MailComposerOptions } from "nodemailer";
import { CONFIG } from "../config";
import { getRandomHexString } from "./utils";

const transporter = nodemailer.createTransport({
    host: CONFIG.SMTP_HOST,
    port: CONFIG.SMTP_PORT,
    secure: CONFIG.SMTP_SECURE,
    auth: {
        user: CONFIG.SMTP_USER,
        pass: CONFIG.SMTP_PASSWORD,
    },
    logger: false,
    debug: false,
});

export async function verifySMTPConnection(): Promise<boolean> {
    try {
        await transporter.verify();
        console.info("Connection to SMTP server successful.");
        return true;
    } catch (error) {
        console.error("Connection to SMTP server failed:", error);
        return false;
    }
}

verifySMTPConnection();

export async function sendMail(recipientEmail: string, subject: string, text: string, html: string, id: string = getRandomHexString(128), files: MailComposerOptions["attachments"] = []): Promise<SMTPSentMessageInfo | null> {
    try {
        const info = await transporter.sendMail({
            from: `${CONFIG.EMAIL_SENDER_NAME} <${CONFIG.EMAIL_SENDER_ADDRESS}>`,
            to: recipientEmail,
            subject: subject,
            text: text,
            html: html,
            attachments: files.length > 0 ? files : undefined,
            dsn: {
                id: id + "-" + getRandomHexString(4),
                return: "full",
                notify: ["failure", "delay"],
                recipient: CONFIG.EMAIL_SENDER_ADDRESS,
            },
        });

        return info;
    } catch (error) {
        console.error(error);

        return null;
    }
}
