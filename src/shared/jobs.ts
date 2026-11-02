// Run these jobs on startup and every 24 hours to ensure that the member data is up-to-date.
// If some jobs fail, they will be retried 5 times and if that does not work, an email will be sent to the admins
// If that email cannot be sent, the app will crash, because this is a critical error and needs to be fixed immediately

import { PUBLIC_CONFIG } from "../publicConfig";
import { waitForDatabase } from "./connection.database";
import { updateLocalFilesMetadataDatabase } from "./files.job";
import { sendCriticalJobFailureNotification } from "./jobs.email";
import { setUserTypeToMemberForAllVerifiedLegacyMembers, resetUserTypeForAllUnverifiedOrRejectedLegacyMembers } from "./member.database";
import { resetLegacyMemberStatusIfPeriodHasEnded } from "./member.jobs";
import { sleep } from "./utils";

const MAX_RETRIES = 5;

/**
 * <Function>databaseJobsWrapper</Function>
 *
 * Wrapper function for running background database jobs with automatic retry logic.
 * Encapsulates common error handling, retry attempts (default 5 retries), and critical failure email notifications.
 * If a job fails more than `maxRetries` times but emails still send successfully, abandons further retries to avoid excessive spam.
 * Logs progress: shows attempt numbers, job names, successes, warnings, or errors for monitoring and debugging.
 * Intended as decorator/executor for scheduled maintenance tasks like member status updates, file sync, etc.
 *
 * @param {Function} jobFunction - Async function (zero parameters) representing the database operation to execute. Should return DatabaseResult object; void functions wrapped will throw on non-DatabaseResult returns.
 * @param {string} name - Human-readable job name for console output and error messages (e.g., "updateMembers", "syncFiles"). Must be concise for log formatting.
 * @returns {Promise<void>} Never returns a value under normal conditions. Always void; logs completion or abandonment to console, sends critical email if retries exhausted before exiting. Throws Error only if maxRetries exceeded AND even error notification emails fail in which case app crashes (critical error). Logs all warnings and errors during execution.
 */
async function databaseJobsWrapper(jobFunction: Function, name: string, retries: number = 0): Promise<void> {
    if (retries > MAX_RETRIES) {
        const errorMessage = `${name} failed after ${MAX_RETRIES} retries. Sending email to admins...`;

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

    console.info(`Running job: ${name} (Attempt ${retries + 1}/${MAX_RETRIES})`);

    const result = await jobFunction();

    if (result.error) {
        console.error(`${name} failed with error: ${result.error}. Retrying in 10 seconds... (${retries + 1}/${MAX_RETRIES})`);

        await sleep(10000); // Wait for 10 seconds before retrying

        await databaseJobsWrapper(jobFunction, name, retries + 1);

        return;
    } else {
        console.info(`${name} completed successfully.`);
        return;
    }
}

/**
 * <Function>runAllJobs</Function>
 *
 * Executes all scheduled maintenance/background jobs sequentially. Calls each background processing function with retry wrappers.
 * Intended for startup on app initialization and cron-based execution every 24 hours via setInterval in this file.
 * Jobs include: database connection check, legacy member status reset, user type updates for verified/rejected members, file metadata sync with CDN.
 * Each individual job has its own retry logic delegated to `databaseJobsWrapper` helper function above. Logs progress messages throughout runtime.
 * If all jobs complete successfully, logs success message and returns normally (void). Never throws under normal conditions unless critical errors occur.
 *
 * @returns {Promise<void>} Never returns a value; always void since startup call runs immediately and cron interval triggers async execution without waiting for app to exit.
 */
async function runAllJobs(): Promise<void> {
    console.info("Waiting for database to be ready...");

    await waitForDatabase();

    console.info("Running all jobs...");

    await resetLegacyMemberStatusIfPeriodHasEnded(MAX_RETRIES);

    await databaseJobsWrapper(setUserTypeToMemberForAllVerifiedLegacyMembers, "setUserTypeToMemberForAllVerifiedLegacyMembers");

    await databaseJobsWrapper(resetUserTypeForAllUnverifiedOrRejectedLegacyMembers, "resetUserTypeForAllUnverifiedOrRejectedLegacyMembers");

    await updateLocalFilesMetadataDatabase(MAX_RETRIES);

    console.info("All jobs completed.");
}

runAllJobs();

setInterval(runAllJobs, 24 * 60 * 60 * 1000);
