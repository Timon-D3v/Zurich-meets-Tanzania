import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>createDarkmodeEntry</Function>
 * 
 * Creates a new dark mode preference entry in the database for a user.
 * Stores whether the user prefers dark theme by default, used when loading user settings or first-time setup.
 * Automatically inserts via foreign key to users table (if configured). Returns success result with inserted ID.
 * 
 * @param {number} userId - The unique identifier of the user whose theme preference will be saved.
 * @param {boolean} darkmode - Whether the user prefers dark mode (`true`) or light mode (`false`). Defaults to `false`.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if insertion fails or on failure. Logs errors to console.
 */
export async function createDarkmodeEntry(userId: number, darkmode: boolean = false): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`darkmode\` (\`userId\`, \`darkmode\`) VALUES (?, ?);`, [userId, Number(darkmode)]);

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
