import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>getBoard</Function>
 *
 * Retrieves board members with their roles, professional backgrounds, and motivations.
 * Joins `board`, `users`, and `teamMember` tables to display comprehensive membership information.
 * Useful for displaying board team listings on website (e.g., about page or footer).
 * Returns role, profession, motive from teamMember, secondary picture from users, plus firstName and lastName.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of board member objects) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getBoard(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `SELECT 
                \`board\`.\`role\`, 
                \`teamMember\`.\`profession\`, 
                \`teamMember\`.\`motive\`, 
                \`teamMember\`.\`secondaryPicture\`, 
                \`users\`.\`firstName\`, 
                \`users\`.\`lastName\`, 
                \`users\`.\`picture\` 
            FROM 
                \`zmt\`.\`board\` 
            JOIN 
                \`zmt\`.\`users\` 
            ON 
                \`board\`.\`userId\` = \`users\`.\`id\`
            JOIN 
                \`zmt\`.\`teamMember\`
            ON
                \`board\`.\`userId\` = \`teamMember\`.\`userId\`
            ;`,
        );

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
 * <Function>getBoardDatabase</Function>
 *
 * Retrieves raw board data from the database with all columns.
 * Returns complete board table row data including userId, role for internal admin use or development purposes.
 * Useful when you need full database schema output rather than filtered join results.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all board records) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getBoardDatabase(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`board\`;`);

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
 * <Function>getBoardMemberEntry</Function>
 *
 * Retrieves a specific board member's record by their user ID.
 * Includes role, profession, motive, and other board-related metadata joined with user info.
 * Useful for displaying individual board member profiles or admin lookup operations.
 *
 * @param {number} userId - The unique user ID of the board member to retrieve.
 * @returns {Promise<DatabaseResult>} An object containing `data` (the board member record or null) and `error` (null or error message). Throws a database connection error if no member is found with that ID or on failure. Logs errors to console.
 */
export async function getBoardMemberEntry(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`board\` WHERE \`userId\` = ?`, [userId]);

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
 * <Function>updateBoardRole</Function>
 *
 * Updates a board member's role by their user ID.
 * Used to change roles (e.g., from "volunteer" to "mentor") without affecting other board fields.
 * Useful for admin operations when managing board responsibilities or reassigning duties.
 *
 * @param {number} userId - The unique user ID of the board member whose role will be updated.
 * @param {string} role - The new role string value (e.g., "mentor", "volunteer", "sponsor").
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no board member is found with that ID or on failure. Logs errors to console.
 */
export async function updateBoardRole(userId: number, role: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`board\` SET \`role\` = ? WHERE \`userId\` = ?`, [role, userId]);

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
 * <Function>addBoardMember</Function>
 *
 * Adds a new board member to the database with optional role assignment.
 * Leaves role as null if not specified (for unassigned/new members). Also automatically links via teamMember table.
 * Useful for recruiting new board volunteers or mentors through admin interface or scripts.
 *
 * @param {number} userId - The unique user ID of the person being added to the board.
 * @param {string | null} role - Optional role string value. If `null`, the board member is added without a predefined role.
 * @returns {Promise<DatabaseResult>} An object containing database query result (INSERT ID) and null on success. Throws a database connection error if insertion fails or on failure. Logs errors to console.
 */
export async function addBoardMember(userId: number, role: string | null = null): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`board\` (\`userId\`, \`role\`) VALUES (?, ?)`, [userId, role]);

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
 * <Function>removeBoardMember</Function>
 *
 * Removes a board member from the database by their user ID.
 * Completely deletes the board membership record. Use for resignation processing or cleanup operations.
 * Note: This does NOT revoke access rights; remove associated teamMember records separately if needed.
 *
 * @param {number} userId - The unique user ID of the board member to remove from the list.
 * @returns {Promise<DatabaseResult>} An object containing database query result (deleted row count) and null on success. Throws a database connection error if no board member is found with that ID or on failure. Logs errors to console.
 */
export async function removeBoardMember(userId: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`DELETE FROM \`zmt\`.\`board\` WHERE \`userId\` = ?`, [userId]);

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
