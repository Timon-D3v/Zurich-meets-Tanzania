import nodemailer, { SMTPSentMessageInfo, MailComposerOptions } from "nodemailer";
import { CONFIG } from "../config";
import { getRandomHexString } from "./utils";

/**
 * <Variable>transporter</Variable>
 *
 * Nodemailer transport configuration object for sending emails via SMTP.
 * Created once during module initialization using environment configuration for recipient authentication credentials.
 * Reuses connection pooling internally to minimize overhead when sending multiple emails in quick succession.
 * Logs disabled (logger: false, debug: false) to prevent verbose server information from appearing in logs during normal operation.
 * Configured with TLS/SSL according to CONFIG.SMTP_SECURE flag for secure transmission of email content over network connections.
 */
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

/**
 * <Function>verifySMTPConnection</Function>
 *
 * Test connection to the configured SMTP server using Nodemailer's built-in verification routine.
 * Used during application startup or configuration validation to ensure email delivery infrastructure is operational before accepting requests.
 * Returns true if transport can connect and authenticate; false if network issues prevent successful handshake or credentials are invalid.
 * Console logs connection attempt result so administrators can verify email system status independently.
 * Runs once on module load, but can be called again explicitly after configuration changes require re-initialization.
 *
 * @returns {Promise<boolean>} Returns `true` if SMTP connection verification succeeded and server acknowledged the transport.
 *                         Returns `false` if connection failed or authentication could not be completed. Logs console messages for status check.
 */
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

/**
 * <Function>sendMail</Function>
 *
 * Constructs and sends an email via Nodemailer transport with full DSN (Delivery Status Notification) tracking.
 * Used throughout the application for sending notifications, newsletters, transactional messages, or any outbound email communication.
 * Automatically generates unique message ID combining provided id parameter with random hex string to ensure uniqueness even with same input data.
 * Sends DSN notifications (notify: ["failure", "delay"]) back to specified address for post-delivery status monitoring if needed.
 * Returns full SMTP envelope information object on success including messageId, timestamps, remote/server metadata from mail transaction logs.
 * On failure returns null without throwing; errors logged via console.error for debugging delivery problems or recipient issues.
 *
 * @param {string} recipientEmail - Complete email address of the email recipient (can be one or multiple addresses space-separated if needed).
 * @param {string} subject - Email subject line shown in recipient's inbox and client headers. Can include plain text or markdown-formatted text.
 * @param {string} text - Plain text body of the email used by text-only email clients, MTA relays, or mailboxes not handling MIME multipart messages properly.
 * @param {string} html - HTML body of the email with formatting tags displayed in modern webmail clients and email viewers supporting rich content rendering.
 * @param {string} [id] - Optional unique identifier string appended to DSN tracking ID for correlating delivery status reports (default generated random 128-char hex).
 * @param {MailComposerOptions["attachments"]} [files] - Array of Nodemailer attachment objects including files, inline images, or documents embedded in email body. Pass empty array [] for no attachments.
 * @returns {Promise<SMTPSentMessageInfo|null>} Returns complete SMTP envelope information on success with messageId and delivery metadata.
 *                                              Returns `null` if transport error occurs during sending (network failure, authentication failure, invalid recipient). Logs errors to console. Throws no explicit errors; uses try/catch for graceful failure handling.
 */
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
