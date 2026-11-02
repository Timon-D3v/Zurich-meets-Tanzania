import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { PUBLIC_CONFIG } from "../publicConfig";
import { DatabaseResult } from "..";

/**
 * <Function>getAllDonationUsageTypes</Function>
 *
 * Retrieves all donation usage types (purpose categories) from the database.
 * Usage types define categories for where donations can be spent (e.g., "Project A", "Research").
 * Useful for dropdown populations in donation forms and admin interfaces.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of usage type objects) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllDonationUsageTypes(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`title\` FROM \`zmt\`.\`donationUsageTypes\`;`);

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
 * <Function>getDonationRequests</Function>
 *
 * Retrieves all donation requests from the database (both pending and reviewed).
 * Includes complete request data with amount, donor information, usage type, and reviewed status.
 * Useful for admin panel views showing all donations or filtering by status in reports.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of donation request objects) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getDonationRequests(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`donationRequests\`;`);

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
 * <Function>getOpenDonationRequests</Function>
 *
 * Retrieves only pending (unreviewed) donation requests awaiting administration approval.
 * These requests have not yet been reviewed by admin staff and need validation before processing.
 * Useful for admin panel views where only action-required donations are needed to be displayed.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of unreviewed donation objects) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getOpenDonationRequests(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`donationRequests\` WHERE \`reviewed\` = FALSE;`);

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
 * <Function>getDonationRequestById</Function>
 *
 * Retrieves a specific donation request by its unique database ID for editing or detail views.
 * Admin staff use this function to view individual donation details for review/approval workflows.
 * If no donation with matching ID exists, returns an empty result instead of throwing.
 *
 * @param {number} id - The unique identifier of the donation request to fetch.
 * @returns {Promise<DatabaseResult>} An object containing `data` (the individual donation request object or null) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getDonationRequestById(id: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`donationRequests\` WHERE \`id\` = ?;`, [id]);

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
 * <Function>reviewDonationRequest</Function>
 *
 * Reviews and processes a donation request by marking it as validated or rejected.
 * When accepted: sets validation status to approved and marks request as reviewed (completes intake process).
 * When rejected: sets validation status appropriately (rejects the donation). Reviewed requests appear in admin dashboard.
 * Useful for admin staff processing donations after checking donor information and fund availability.
 *
 * @param {number} id - The unique identifier of the donation request to review.
 * @param {boolean} accepted - Whether to accept (`true`) or reject (`false`) the donation.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no request is found with that ID or on failure. Logs errors to console.
 */
export async function reviewDonationRequest(id: number, accepted: boolean): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`donationRequests\` SET \`validated\` = ?, reviewed = TRUE WHERE \`id\` = ?;`, [accepted, id]);

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
 * <Function>insertDonationRequest</Function>
 *
 * Creates a new donation request record in the database when someone submits a donation form.
 * Stores amount, donor information (name, email), and designated usage type for tracking purposes.
 * Used when processing donations from website visitors via Stripe payment integration.
 * Returns empty result on success; error message if database operation fails.
 *
 * @param {number} amount - The donation amount in Swiss Francs (CHF).
 * @param {string} firstName - The donor's first name.
 * @param {string} lastName - The donor's last name.
 * @param {string} email - The donor's contact email address.
 * @param {string} usageType - Purpose/category this donation should support (must match valid usage types).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if insertion fails or on failure. Logs errors to console.
 */
export async function insertDonationRequest(amount: number, firstName: string, lastName: string, email: string, usageType: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`donationRequests\` (\`amount\`, \`firstName\`, \`lastName\`, \`email\`, \`usageType\`) VALUES (?, ?, ?, ?, ?);`, [
            amount,
            firstName,
            lastName,
            email,
            usageType,
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
 * <Function>getAllDonationMeters</Function>
 *
 * Retrieves all active donation meter (fundraising goal) entries from the database.
 * Donation meters track progress toward fundraising goals, displaying visual progress bars on website.
 * Only returns currently active meters (incomplete or inactive are hidden). Useful for homepage display.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of active donation meter objects) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllDonationMeters(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`donationMeter\` WHERE \`active\` = TRUE;`);

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
 * <Function>createDonationMeter</Function>
 *
 * Creates a new donation goal/fundraising campaign in the database.
 * Donation meters display visual progress tracking toward their target fundraising amounts on website.
 * Automatically initializes currentValue to 0 when created. Useful for annual campaigns or special projects.
 * Note: The function inserts into `donationMeter` table using title as primary key for uniqueness.
 *
 * @param {string} title - A unique identifier/title for this donation meter/campaign.
 * @param {string} description - Human-readable explanation of what the funds raise money for.
 * @param {number} target - The fundraising goal amount in CHF (the maxValue for progress calculation).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if insertion fails or on failure. Logs errors to console.
 */
export async function createDonationMeter(title: string, description: string, target: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`donationMeter\` (\`title\`, \`description\`, \`currentValue\`, \`maxValue\`) VALUES (?, ?, 0, ?)`, [title, description, target]);

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
 * <Function>deactivateDonationMeterWithId</Function>
 *
 * Marks a donation meter/campaign as inactive (hidden from public view).
 * Called when a campaign is completed or should no longer be displayed. Keeps historical data intact but stops showing progress bar to visitors.
 * Use `createDonationMeter` to reset/reenable campaigns later if needed.
 *
 * @param {number} id - The unique identifier of the donation meter to deactivate.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no meter is found with that ID or on failure. Logs errors to console.
 */
export async function deactivateDonationMeterWithId(id: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`donationMeter\` SET \`active\` = FALSE WHERE \`id\` = ?`, [id]);

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
 * <Function>updateDonationMeterWithId</Function>
 *
 * Updates multiple fields of a donation meter by its unique identifier.
 * Can modify title, description, current progress amount (currentValue), and target goal (maxValue).
 * Useful for admin adjustments to campaign details or goal amounts during execution.
 * Note: Title is changed to new value even if previously used elsewhere; this creates inconsistency but allows reusing campaigns.
 *
 * @param {number} id - The unique identifier of the donation meter to update.
 * @param {string} title - New campaign/title name (optional, can omit).
 * @param {string} description - New explanation for what funds are raised for (optional, can omit).
 * @param {number} currentValue - Current fundraising progress amount in CHF.
 * @param {number} maxValue - Target goal amount in CHF for the campaign (progress is displayed as fraction of this value).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no meter is found with that ID or on failure. Logs errors to console.
 */
export async function updateDonationMeterWithId(id: number, title: string, description: string, currentValue: number, maxValue: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`donationMeter\` SET \`title\` = ?, \`description\` = ?, \`currentValue\` = ?, \`maxValue\` = ? WHERE \`id\` = ?`, [
            title,
            description,
            currentValue,
            maxValue,
            id,
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
 * <Function>increaseDonationMeter</Function>
 *
 * Increments the current fundraising amount for a named donation campaign by the given amount.
 * Automatically only updates active campaigns (those with active=TRUE flag). Useful when donation processed but needs to update meter separately from database insert/insert logic.
 * The actual donation money flow should happen through Stripe checkout/session first, then this call updates tracking.
 *
 * @param {string} title - The unique identifier/title of the donation campaign/meter to increment.
 * @param {number} amount - Amount in CHF to add to the current fundraising total (can be fractional).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no active meter is found with that title or on failure. Logs errors to console.
 */
export async function increaseDonationMeter(title: string, amount: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`donationMeter\` SET \`currentValue\` = \`currentValue\` + ? WHERE \`title\` = ? AND \`active\` = TRUE`, [amount, title]);

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
 * <Function>getAllDonors</Function>
 *
 * Retrieves aggregated donor data showing each unique donor's total contribution and name.
 * Performs SQL GROUP BY on validated donations only (validated=TRUE), summing amounts per email address combined with name for identifying donors.
 * Useful for recognition lists thanking top contributors or generating donor acknowledgments at year-end.
 * Note: This uses a multi-column UNIQUE KEY (email, firstName, lastName) and returns one row per unique donor identified by this combination.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of donor objects with email, totalAmount, firstName, lastName) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllDonors(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `SELECT \`email\`, SUM(\`amount\`) as \`totalAmount\`, \`firstName\`, \`lastName\` FROM \`zmt\`.\`donationRequests\` WHERE \`validated\` = TRUE GROUP BY \`email\`, \`firstName\`, \`lastName\`;`,
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
