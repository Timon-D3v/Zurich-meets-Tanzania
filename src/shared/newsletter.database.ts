import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>getAllNewsletterEmails</Function>
 * 
 * Retrieves only the email addresses of newsletter subscribers (without full user details).
 * Useful for building mailing lists, validation before sending newsletters, or export operations.
 * Returns a flat array of strings containing recipient emails only.
 * 
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of email address objects with email field) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllNewsletterEmails(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`email\` from \`zmt\`.\`newsletter\`;`);

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
 * <Function>getAllNewsletterUsers</Function>
 * 
 * Retrieves all newsletter subscriber records with complete user data including name and gender.
 * Useful for viewing subscriber list in admin panel, or preparing data for bulk operations (newsletters, unsubscriptions).
 * Returns full user objects rather than just emails for display/admin purposes.
 * 
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of complete newsletter user objects) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllNewsletterUsers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`newsletter\`;`);

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
 * <Function>getNewsletterDetailsWithEmail</Function>
 * 
 * Retrieves a newsletter subscriber's details by their email address.
 * Uses the unique email field as lookup key (stored as UNIQUE KEY in table).
 * Returns full record including name, gender, timestamp when helpful for validation or editing subscriber records.
 * 
 * @param {string} email - The email address of the subscriber whose details to retrieve.
 * @returns {Promise<DatabaseResult>} An object containing `data` (array with single row if found or empty array) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getNewsletterDetailsWithEmail(email: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`newsletter\` WHERE \`email\` = ?;`, [email]);

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
 * <Function>addToNewsletterList</Function>
 * 
 * Subscribes a new person to the newsletter by inserting their data into the database.
 * Used both via admin panel when someone signs up, and programmatically for bulk additions.
 * Gender field accepts values: "Herr" (Mr), "Frau" (Mrs), or "Divers" (other/no gender).
 * Returns successfully inserted row ID in result; empty array if database insertion fails.
 * 
 * @param {string} email - The newsletter recipient's unique email address.
 * @param {string} firstName - The subscriber's first name.
 * @param {string} lastName - The subscriber's last name.
 * @param {('Herr'|'Frau'|'Divers')} gender - Gender preference: Herr = Mr, Frau = Mrs, Divers = other.
 * @returns {Promise<DatabaseResult>} An object containing database query result (INSERT ID) and null on success. Throws a database connection error if insertion fails or on failure. Logs errors to console.
 */
export async function addToNewsletterList(email: string, firstName: string, lastName: string, gender: "Herr" | "Frau" | "Divers"): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`newsletter\` (\`gender\`, \`firstName\`, \`lastName\`, \`email\`) VALUES (?, ?, ?, ?);`, [gender, firstName, lastName, email]);

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
 * <Function>updateNewsletterList</Function>
 * 
 * Updates an existing newsletter subscriber's information by their email address.
 * Used to correct name, gender, or remove from list (see removeFromNewsletterList for deletion).
 * Uses the UNIQUE KEY on email field to locate and update the specific subscriber record.
 * If subscriber not found, database returns zero rows changed.
 * 
 * @param {string} email - The email address of the newsletter subscriber whose data will be updated.
 * @param {string} firstName - New first name for this subscriber.
 * @param {string} lastName - New last name for this subscriber.
 * @param {('Herr'|'Frau'|'Divers')} gender - New gender preference: Herr = Mr, Frau = Mrs, Divers = other.
 * @returns {Promise<DatabaseResult>} An object containing database query result (updated row count) and null on success. Throws a database connection error if email not found or on failure. Logs errors to console.
 */
export async function updateNewsletterList(email: string, firstName: string, lastName: string, gender: "Herr" | "Frau" | "Divers"): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`newsletter\` SET \`gender\` = ?, \`firstName\` = ?, \`lastName\` = ? WHERE \`email\` = ?;`, [gender, firstName, lastName, email]);

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
 * <Function>removeFromNewsletterList</Function>
 * 
 * Removes a subscriber from the newsletter mailing list by their email address.
 * Deletes the record completely. Called either via admin panel for unsubscribe requests
 * or programmatically during data cleanup. Does NOT send confirmation emails (use newsletter.email.ts for that).
 * Returns zero rows affected if unsubscribed user not found in database.
 * 
 * @param {string} email - The email address of the newsletter subscriber to remove from list.
 * @returns {Promise<DatabaseResult>} An object containing database query result (deleted row count) and null on success. Throws a database connection error on failure. Logs errors to console.
 */
export async function removeFromNewsletterList(email: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`DELETE FROM \`zmt\`.\`newsletter\` WHERE \`email\` = ?;`, [email]);

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
