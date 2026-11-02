import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>getLastXCalendarEvents</Function>
 *
 * Retrieves up to the last N upcoming calendar events from the database.
 * Only shows events that are currently active (both start and end dates are in the future).
 * Events are ordered by start date from earliest to latest. Useful for displaying on homepage or dashboard.
 *
 * @param {number} x - Maximum number of events to retrieve (useful for pagination or limiting display).
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of event objects) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getLastXCalendarEvents(x: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`calendar\` WHERE (\`startDate\` > CURRENT_TIMESTAMP && \`endDate\` > CURRENT_TIMESTAMP) ORDER BY \`startDate\` ASC LIMIT ${x};`);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>getAllCalendarEvents</Function>
 *
 * Retrieves all upcoming calendar events from the database.
 * Only includes events that are currently active (both start and end dates are in the future).
 * Events are fully ordered by start date from earliest to latest for proper display ordering.
 * Useful for displaying complete event lists in admin panels or archives.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all active event objects) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllCalendarEvents(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`calendar\` WHERE (\`startDate\` > CURRENT_TIMESTAMP && \`endDate\` > CURRENT_TIMESTAMP) ORDER BY \`startDate\` ASC;`);

        return {
            data: result,
            error: null,
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            data: null,
            error: PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE,
        };
    }
}

/**
 * <Function>createCalendarEvent</Function>
 *
 * Creates a new calendar event entry in the database.
 * Stores title, start date, and end date for future events display. Only active events (before their end date) are shown to users.
 * Useful for administrative event creation via admin panel or backend scripts.
 *
 * @param {string} title - The event title/name displayed on calendar views.
 * @param {string} startDate - ISO timestamp string representing when the event starts.
 * @param {string} endDate - ISO timestamp string representing when the event ends (must be after startDate for an active event).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if insertion fails or on database failure. Logs errors to console.
 */
export async function createCalendarEvent(title: string, startDate: string, endDate: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`calendar\` (\`title\`, \`startDate\`, \`endDate\`) VALUES (?, ?, ?);`, [title, startDate, endDate]);

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
 * <Function>deleteCalendarEvent</Function>
 *
 * Deletes a specific calendar event from the database by its unique ID.
 * Called when removing events via admin panel or when updating an existing event (deleting then re-creating).
 * Only affects events that are stored in the database (past/expired events are never shown to users).
 *
 * @param {number} id - The unique identifier of the event to delete from the database.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no event is found with that ID or on failure. Logs errors to console.
 */
export async function deleteCalendarEvent(id: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`DELETE FROM \`zmt\`.\`calendar\` WHERE \`id\` = ?;`, [id]);

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
