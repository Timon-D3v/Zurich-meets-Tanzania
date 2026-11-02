import { PUBLIC_CONFIG } from "../publicConfig";
import { sendCriticalJobFailureNotification } from "./jobs.email";
import { getAllLegacyMembers, resetLegacyMemberStatusForExpiredLegacyMember } from "./member.database";
import { sendLegacyMemberExpireNotice, sendLegacyMemberRequestEmail } from "./member.email";
import { sleep } from "./utils";

/**
 * <Function>resetLegacyMemberStatusIfPeriodHasEnded</Function>
 *
 * Checks legacy members with expired membership periods and resets their status to unverified.
 * Sends expiration notice emails to affected members and requests new re-submission for manual memberships.
 * Retries database operations on failure (with exponential backoff of 10 seconds) up to configurable max retries.
 * Uses getAllLegacyMembers to fetch all legacy members, then processes each one whose periodEndTime is before now.
 * For verified members with expired periods: resets status, sends expiration notice, and requests new membership form.
 * Part of automated member management for legacy (non-Stripe) membership renewals.
 *
 * @param {number} maxRetries - Maximum number of retry attempts for failed database queries (default: 5).
 * @param {number} retries - Current retry attempt count, incremented on failure (default: 0).
 * @returns {Promise<void>} Executes member status checks and sends notifications. Logs information about processed members or errors during execution. Throws no explicit errors; may log to console on issues.
 */
export async function resetLegacyMemberStatusIfPeriodHasEnded(maxRetries: number = 5, retries: number = 0): Promise<void> {
    const name = "resetLegacyMemberStatusIfPeriodHasEnded";

    if (retries > maxRetries) {
        const errorMessage = `${name} failed after ${maxRetries} retries. Sending email to admins...`;

        console.error(errorMessage);

        const developerResult = await sendCriticalJobFailureNotification(PUBLIC_CONFIG.PERSONAS["DEVELOPER"].name, PUBLIC_CONFIG.PERSONAS["DEVELOPER"].email, errorMessage);
        const chairmanResult = await sendCriticalJobFailureNotification(PUBLIC_CONFIG.PERSONAS["CHAIRMAN"].name, PUBLIC_CONFIG.PERSONAS["CHAIRMAN"].email, errorMessage);

        if (!developerResult || !chairmanResult) {
            // Something went terribly wrong, when not even the email could be sent
            // => Crash the app
            throw new Error("Critical error: Failed to send email to admins after job failure.");
        }

        return;
    }

    console.info(`Running job: ${name} (Attempt ${retries + 1}/${maxRetries})`);

    const result = await getAllLegacyMembers();

    if (result.error || result.data === null) {
        console.error(`${name} failed with error: ${result.error}. Retrying in 10 seconds... (${retries + 1}/${maxRetries})`);

        await sleep(10000); // Wait for 10 seconds before retrying

        return await resetLegacyMemberStatusIfPeriodHasEnded(maxRetries, retries + 1);
    }

    for (let i = 0; i < result.data.length; i++) {
        const legacyMember = result.data[i];

        if (legacyMember.status === "verified" && legacyMember.periodEndTime < Date.now()) {
            console.info(`Legacy member with userId ${legacyMember.userId} has an expired period. Resetting status to "unverified"...`);

            const resetResult = await resetLegacyMemberStatusForExpiredLegacyMember(legacyMember.userId, legacyMember.legacyMemberId);

            if (resetResult.error) {
                console.error(`${name} failed with error: ${resetResult.error}. Retrying... (${retries + 1}/${maxRetries})`);

                return await resetLegacyMemberStatusIfPeriodHasEnded(maxRetries, retries + 1);
            }

            const expireNoticeResult = await sendLegacyMemberExpireNotice(legacyMember.firstName, legacyMember.lastName, legacyMember.email);
            const requestEmailResult = await sendLegacyMemberRequestEmail(legacyMember.firstName, legacyMember.lastName, legacyMember.email);

            if (!expireNoticeResult || !requestEmailResult) {
                console.error(`${name} failed to send email to ${legacyMember.email}. Retrying... (${retries + 1}/${maxRetries})`);

                return await resetLegacyMemberStatusIfPeriodHasEnded(maxRetries, retries + 1);
            }
        }
    }

    console.info(`${name} completed successfully.`);

    return;
}
