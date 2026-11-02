import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>getThemeFromUserId</Function>
 * 
 * Retrieves a user's theme preference (dark/light mode) stored in the database.
 * Reads from the darkmode table and returns whether the user prefers dark theme or not.
 * Used when loading user settings on page load to customize their viewing experience automatically.
 * 
 * @param {number} id - The unique identifier of the user whose theme preference to retrieve.
 * @returns {Promise<DatabaseResult>} An object containing `data` (array with single row containing darkmode boolean or empty/zero if not set) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getThemeFromUserId(id: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`darkmode\` from \`zmt\`.\`darkmode\` WHERE \`userId\` = ?;`, [id]);

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
 * <Function>setThemeForUserId</Function>
 * 
 * Saves a user's theme preference (dark or light mode) to the database.
 * Allows users to customize their viewing experience by storing their choice for sessions without manual toggle.
 * Converts boolean input to Number (0/1 before MySQL storage). Used in user settings management.
 * 
 * @param {boolean} isDarkTheme - `true` to set dark mode, `false` for light mode.
 * @param {number} id - The unique identifier of the user whose preference will be saved.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user/theme record found or on failure. Logs errors to console.
 */
export async function setThemeForUserId(isDarkTheme: boolean, id: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`darkmode\` SET \`darkmode\` = ? WHERE (\`userId\` = ?);`, [Number(isDarkTheme), id]);

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
