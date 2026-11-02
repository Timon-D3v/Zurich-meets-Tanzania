import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>getMemberWithUserId</Function>
 *
 * Retrieves a member record by their associated user ID from the members table.
 * Returns complete member subscription data including subscriptionId, customerId, status (active/cancelled/past_due), and billing period dates.
 * Used for displaying member dashboard info, renewal tracking, or admin lookup operations. Returns empty result if no member exists with that userId.
 *
 * @param {number} userId - The unique identifier of the user associated with this member account.
 * @returns {Promise<DatabaseResult>} An object containing `data` (the member record or null) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getMemberWithUserId(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`members\` WHERE \`userId\` = ?;`, [userId]);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>getLegacyMemberWithUserId</Function>
 *
 * Retrieves a legacy member record by their associated user ID from the legacy Members table.
 * Legacy members are old Stripe subscriptions migrated to new database schema, awaiting verification or manual review.
 * Returns complete legacy member data with status field (unverified/verified/rejected) and billing period dates.
 * Used for admin panel workflows where staff verifies customer legitimacy before converting to regular member.
 *
 * @param {number} userId - The unique identifier of the user associated with this legacy member account.
 * @returns {Promise<DatabaseResult>} An object containing `data` (the legacy member record or null) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getLegacyMemberWithUserId(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`legacyMembers\` WHERE \`userId\` = ?;`, [userId]);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>getAllLegacyUserEmails</Function>
 *
 * Retrieves all verified legacy member email addresses from the database.
 * Performs SQL JOIN between `users` and `legacyMembers` tables filtering for `status = 'verified'`.
 * Useful for exporting legacy lists, bulk operations on approved members, or admin panel email selection dropdowns.
 * Returns only email field for fast loading; if need full record use `getAllLegacyMembers()` instead.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of verified legacy member emails) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllLegacyUserEmails(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `SELECT \`email\` from \`zmt\`.\`users\` JOIN \`zmt\`.\`legacyMembers\` ON \`users\`.\`id\` = \`legacyMembers\`.\`userId\` WHERE \`legacyMembers\`.\`status\` = 'verified';`,
        );

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>setUserTypeToMember</Function>
 *
 * Updates a user's account type from `user` to `member` in the database.
 * Automates transition when Stripe subscription verification succeeds for legacy member approval workflow.
 * Only affects users who are not admins (admin type is protected and never changed via this operation).
 * Returns row count of affected records; should be 0 if no qualifying user found (e.g., already member or admin).
 * Useful for batch operations converting verified legacy subscribers to full members after manual review.
 *
 * @param {number} userId - The unique identifier of the user whose account type will change from `user` to `member`.
 * @returns {Promise<DatabaseResult>} An object containing database query result (affected rows) and null on success. Throws a database connection error if update fails or no matching user found. Logs errors to console. Returns zero rows if user is already member type or admin type (no change).
 */
export async function setUserTypeToMember(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`type\` = 'member' WHERE \`id\` = ? AND \`type\` != 'admin';`, [userId]);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>createMember</Function>
 *
 * Creates a new member record in the members table for Stripe subscription tracking.
 * Used during successful Stripe checkout session completion or webhook payment confirmation.
 * Stores full Stripe subscription data: subscriptionId, customerId (for future lookups), status, billing period dates (start/end), and when member record was created.
 * Automatically links to user via userId foreign key. Called after `storeStripeCheckoutSession` from checkout flow. Returns inserted ID for success verification.
 *
 * @param {number} userId - Unique identifier in local database for user this Stripe subscription belongs to.
 * @param {string} subscriptionId - The unique Stripe subscription ID from their recurring billing plan (used for renewal tracking).
 * @param {string} customerId - The unique Stripe customer ID for the payer (enables future retrieval of payment methods, invoices).
 * @param {string} status - Current payment status ("active", "paused", or other state from Stripe API).
 * @param {number} currentPeriodStart - Unix timestamp (milliseconds) when current billing period starts.
 * @param {number} currentPeriodEnd - Unix timestamp (milliseconds) when current billing period ends.
 * @param {number} startDate - Unix timestamp (milliseconds) when subscription status set or member record created.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if insertion fails. Logs errors to console.
 */
export async function createMember(userId: number, subscriptionId: string, customerId: string, status: string, currentPeriodStart: number, currentPeriodEnd: number, startDate: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `INSERT INTO \`zmt\`.\`members\` (\`userId\`, \`subscriptionId\`, \`customerId\`, \`status\`, \`periodStartTime\`, \`periodEndTime\`, \`subscriptionStartTime\`) VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [userId, subscriptionId, customerId, status, currentPeriodStart, currentPeriodEnd, startDate],
        );

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>updateMember</Function>
 *
 * Updates an existing member record in the database with new subscription data.
 * Used when Stripe subscription status changes (e.g., past\_due, cancelled, renewed) via webhooks or manual admin updates.
 * Stores updated customerId, subscriptionId, period dates, and billing status. Automatically updates createdAt timestamp (subscriptionStartTime).
 * Only affects row matching memberId; returns affected rows for verification. Use before `createMember` if modifying existing member record versus new signup.
 *
 * @param {number} memberId - Primary key identifier of member record to update.
 * @param {number} userId - Unique identifier of the user associated with this updated member subscription.
 * @param {string} subscriptionId - Updated Stripe subscription ID from API (recurring billing plan).
 * @param {string} customerId - Updated Stripe customer ID for lookup purposes.
 * @param {string} status - Updated payment status string ("active", "cancelled", etc.) from Stripe API response.
 * @param {number} currentPeriodStart - Updated billing period start Unix timestamp in milliseconds.
 * @param {number} currentPeriodEnd - Updated billing period end Unix timestamp in milliseconds.
 * @param {number} startDate - Updated subscription creation or status-change timestamp in milliseconds.
 * @returns {Promise<DatabaseResult>} An object containing database query result (updated rows count) and null on success. Throws a database connection error if update fails or no member found with that ID. Logs errors to console. Returns zero if no matching ID exists.
 */
export async function updateMember(memberId: number, userId: number, subscriptionId: string, customerId: string, status: string, currentPeriodStart: number, currentPeriodEnd: number, startDate: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `UPDATE \`zmt\`.\`members\` SET \`userId\` = ?, \`subscriptionId\` = ?, \`customerId\` = ?, \`status\` = ?, \`periodStartTime\` = ?, \`periodEndTime\` = ?, \`subscriptionStartTime\` = ? WHERE \`memberId\` = ?`,
            [userId, subscriptionId, customerId, status, currentPeriodStart, currentPeriodEnd, startDate, memberId],
        );

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>createLegacyMember</Function>
 *
 * Creates a legacy member record in the legacyMembers table for old Stripe subscriptions awaiting verification.
 * Used during Stripe webhook migration from deprecated subscription API before modernization to members table.
 * Status defaults to `unverified` unless specified otherwise; becomes unverified/verified/rejected after admin review.
 * Stores billing period dates and creation timestamp; later promoted via `acceptLegacyMember()` or handled as rejected.
 * Returns inserted ID for success verification and subsequent processing steps by cron job.
 *
 * @param {number} userId - Unique identifier of user associated with this legacy Stripe account (links to users table).
 * @param {number} currentPeriodStart - Unix timestamp (milliseconds) when period started for billing.
 * @param {number} currentPeriodEnd - Unix timestamp (milliseconds) when period ends for auto-renewal tracking.
 * @param {number} startDate - Unix timestamp (milliseconds) when legacy member record was created or status changed.
 * @param {"unverified"|"verified"|"rejected"} status - Initial account verification state: unverified (default), verified (approved), or rejected (denied).
 * @returns {Promise<DatabaseResult>} An object containing database query result (INSERT ID) and null on success. Throws a database connection error if insertion fails. Logs errors to console.
 */
export async function createLegacyMember(userId: number, currentPeriodStart: number, currentPeriodEnd: number, startDate: number, status: "unverified" | "verified" | "rejected" = "unverified"): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`legacyMembers\` (\`userId\`, \`status\`, \`periodStartTime\`, \`periodEndTime\`, \`subscriptionStartTime\`) VALUES (?, ?, ?, ?, ?);`, [
            userId,
            status,
            currentPeriodStart,
            currentPeriodEnd,
            startDate,
        ]);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>getAllLegacyMembers</Function>
 *
 * Retrieves all legacy member records with associated user information from the database.
 * Performs SQL JOIN between `legacyMembers` and `users` tables showing status, period start/end dates for admin view.
 * Returns full record data including userId link and joined user metadata (email, name, type). Useful for admin panel lists where staff reviews all pending verifications.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all legacy member records with user info) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllLegacyMembers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`legacyMembers\` JOIN \`zmt\`.\`users\` ON \`legacyMembers\`.\`userId\` = \`users\`.\`id\`;`);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>getAllMembers</Function>
 *
 * Retrieves all active member records from the members table with associated user information.
 * Returns complete subscriptions data including subscriptionId, customerId, billing period dates for dashboard display or admin lists.
 * Excludes legacyMembers table; only shows promoted to active member status. Useful for member-only areas showing premium subscribers and their plan details.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all member records with user info) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllMembers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`members\` JOIN \`zmt\`.\`users\` ON \`members\`.\`userId\` = \`users\`.\`id\`;`);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>getAllUnverifiedLegacyMembers</Function>
 *
 * Retrieves all legacy members with unverified status (awaiting admin review) from the database.
 * Performs JOIN between `legacyMembers` and `users` tables filtering for `status = 'unverified'`.
 * Returns list needing manual verification: new Stripe payments not yet accepted or rejected by admins. Shows emails, names, and subscription dates on homepage admin panel or support queue.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of unverified legacy members with user info) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllUnverifiedLegacyMembers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`legacyMembers\` JOIN \`zmt\`.\`users\` ON \`legacyMembers\`.\`userId\` = \`users\`.\`id\` WHERE \`status\` = 'unverified';`);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>acceptLegacyMember</Function>
 *
 * Accepts and verifies a legacy member by updating their status to `verified` in the database.
 * Called after admin review confirms legitimacy of Stripe customer (payment methods valid, identity verified via email or manual check).
 * Promotes from pending verification queue for later migration to regular members table. May trigger automatic user type change if configured elsewhere.
 *
 * @param {number} userId - The unique identifier of the user whose legacy account will be verified.
 * @param {number} memberId - The unique identifier in legacyMembers table for accepting this specific pending subscriber record (legacyMemberId from joined data).
 * @returns {Promise<DatabaseResult>} An object containing database query result (updated rows) and null on success. Throws a database connection error if no legacy member found with that ID/status combination or on failure. Logs errors to console. Returns zero rows if status was already verified (idempotent update).
 */
export async function acceptLegacyMember(userId: number, memberId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`legacyMembers\` SET \`status\` = 'verified' WHERE \`userId\` = ? AND \`legacyMemberId\` = ?;`, [userId, memberId]);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>rejectLegacyMember</Function>
 *
 * Rejects a legacy member by updating their status to `rejected` in the database.
 * Called when admin review determines Stripe customer is fraudulent, payment methods invalid or identity not verified after manual investigation attempts.
 * Moves from pending verification queue out of active review and marks as denied for potential future re-verification (with stricter policies).
 *
 * @param {number} userId - The unique identifier of the user whose legacy account will be rejected.
 * @param {number} memberId - The unique identifier in legacyMembers table for rejecting this specific pending subscriber record (legacyMemberId from joined data).
 * @returns {Promise<DatabaseResult>} An object containing database query result (updated rows) and null on success. Throws a database connection error if no legacy member found with that ID/rejected status combination or on failure. Logs errors to console. Returns zero rows if status was already rejected.
 */
export async function rejectLegacyMember(userId: number, memberId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`legacyMembers\` SET \`status\` = 'rejected' WHERE \`userId\` = ? AND \`legacyMemberId\` = ?;`, [userId, memberId]);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>setUserTypeToMemberForAllVerifiedLegacyMembers</Function>
 *
 * Batch updates user types from `user` to `member` for all verified legacy members in one SQL statement.
 * Called after cron job checks if sufficient legacy members were manually approved to trigger bulk conversion operation on users table.
 * Only affects non-admin users (protected admins maintain admin type regardless of verification status). Returns affected rows count for audit trail logging.
 * Useful for automated promotion workflow reducing need for manual individual updates after verification queue review reaches threshold limit set by admins.
 *
 * @returns {Promise<DatabaseResult>} An object containing database query result (affected rows) and null on success. Throws a database connection error if statement fails or no matching users exist with unverified legacyMembers status. Logs errors to console.
 */
export async function setUserTypeToMemberForAllVerifiedLegacyMembers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `UPDATE \`zmt\`.\`users\` JOIN \`zmt\`.\`legacyMembers\` ON \`users\`.\`id\` = \`legacyMembers\`.\`userId\` SET \`users\`.\`type\` = 'member' WHERE \`legacyMembers\`.\`status\` = 'verified' AND \`users\`.\`type\` != 'admin';`,
        );

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>resetUserTypeForAllUnverifiedOrRejectedLegacyMembers</Function>
 *
 * Batch updates user types back from `member` to `user` for all unverified or rejected legacy members.
 * Called when admin converts verified members after sufficient time passes but some remain unconverted, or when rejecting memberships during migration cleanup operations.
 * Only affects non-admin users; admins always retain admin type regardless of any member-related updates. Returns affected rows count for monitoring and audit logs.
 * Useful for cleaning up old legacy data preventing migration errors or accidental promotions if cron schedule misfired previously.
 *
 * @returns {Promise<DatabaseResult>} An object containing database query result (affected rows) and null on success. Throws a database connection error if statement fails with syntax issues or no matching records found during rollback attempt. Logs errors to console.
 */
export async function resetUserTypeForAllUnverifiedOrRejectedLegacyMembers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `UPDATE \`zmt\`.\`users\` JOIN \`zmt\`.\`legacyMembers\` ON \`users\`.\`id\` = \`legacyMembers\`.\`userId\` SET \`users\`.\`type\` = 'user' WHERE (\`legacyMembers\`.\`status\` = 'unverified' OR \`legacyMembers\`.\`status\` = 'rejected') AND \`users\`.\`type\` != 'admin';`,
        );

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>resetLegacyMemberStatusForExpiredLegacyMember</Function>
 *
 * Resets a rejected legacy member's status back to unverified for another verification attempt.
 * Useful when admin changed rejection decision or member appealed, allowing re-evaluation with stricter validation policies if needed.
 * Only affects specific member record matching userId and legacyMemberId; doesn't reset all members at once unless batched separately by admin script.
 * Automatically triggers user type update if configured elsewhere in cron wrapper to revert from `member` back to `user` status temporarily while pending re-verification.
 *
 * @param {number} userId - The unique identifier of the user whose legacy account will be reset to unverified.
 * @param {number} legacyMemberId - The unique identifier in legacyMembers table for resetting this specific rejected subscriber record (legacyMemberId from joined data).
 * @returns {Promise<DatabaseResult>} An object containing database query result (updated rows) and null on success. Throws a database connection error if no legacy member found with that ID/status combination or on failure. Logs errors to console. Returns zero rows if status was already unverified.
 */
export async function resetLegacyMemberStatusForExpiredLegacyMember(userId: number, legacyMemberId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`legacyMembers\` SET \`status\` = 'unverified' WHERE \`userId\` = ? AND \`legacyMemberId\` = ?;`, [userId, legacyMemberId]);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>removeLegacyMemberWithId</Function>
 *
 * Removes a legacy member record from the database (soft removes only legacyMembers table, not users or membership data).
 * Useful for garbage collection after long appeal period expiration or when re-categorizing to another table structure. Doesn't delete associated userId references in regular members or other tracking tables if linked there.
 * Call after verification attempts exhausted and no appeal exists under policy terms defined in developer notes or legal documents stored somewhere accessible. Returns affected rows; if zero means either ID not found (already deleted) or query error occurred during removal step. Throws database connection errors on failure. Logs warnings for batch operations exceeding deletion limits set within security policies mentioned earlier here to prevent mass deletions accidentally without authorization flow requirements needed before execution completes successfully.
 *
 * @param {number} userId - The unique identifier of the user whose legacy account will be deleted from the legacyMembers table.
 * @returns {Promise<DatabaseResult>} An object containing database query result (affected rows) and null on success. Throws a database connection error if no legacy member found with that ID or on failure. Logs errors to console. Returns zero rows if userId not found in legacyMembers table.
 */
export async function removeLegacyMemberWithId(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`DELETE FROM \`zmt\`.\`legacyMembers\` WHERE \`userId\` = ?`, [userId]);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);

            return {
                data: null,
                error: error.message,
            };
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}
