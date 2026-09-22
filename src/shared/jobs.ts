// Run these jobs on startup and every 24 hours to ensure that the member data is up-to-date.
// If some jobs fail, they will be retried 5 times and if that does not work, an email will be sent to the admins
// If that email cannot be sent, the app will crash, because this is a critical error and needs to be fixed immediately

import { PUBLIC_CONFIG } from "../publicConfig";
import { sendCriticalJobFailureNotification } from "./jobs.email";
import { setUserTypeToMemberForAllVerifiedLegacyMembers, resetUserTypeForAllUnverifiedOrRejectedLegacyMembers } from "./member.database";
import { resetLegacyMemberStatusIfPeriodHasEnded } from "./member.jobs";

const MAX_RETRIES = 5;

async function databaseJobsWrapper(jobFunction: Function, retries: number = 0) {
    if (retries > MAX_RETRIES) {
        const errorMessage = `${jobFunction.name} failed after ${MAX_RETRIES} retries. Sending email to admins...`;

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

    console.info(`Running job: ${jobFunction.name} (Attempt ${retries + 1}/${MAX_RETRIES})`);

    const result = await jobFunction();

    if (result.error) {
        console.error(`${jobFunction.name} failed with error: ${result.error}. Retrying... (${retries + 1}/${MAX_RETRIES})`);

        await databaseJobsWrapper(jobFunction, retries + 1);

        return;
    } else {
        console.info(`${jobFunction.name} completed successfully.`);
        return;
    }
}

async function runAllJobs() {
    console.info("Running all jobs...");

    await resetLegacyMemberStatusIfPeriodHasEnded(MAX_RETRIES);

    await databaseJobsWrapper(setUserTypeToMemberForAllVerifiedLegacyMembers);

    await databaseJobsWrapper(resetUserTypeForAllUnverifiedOrRejectedLegacyMembers);

    console.info("All jobs completed.");
}

runAllJobs();

setInterval(runAllJobs, 24 * 60 * 60 * 1000);
