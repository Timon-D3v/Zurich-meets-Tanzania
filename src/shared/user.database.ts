import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult } from "../index.js";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>getUserWithEmail</Function>
 *
 * Retrieves user information from the database by email address.
 *
 * @param {string} email - The email address of the user to find.
 * @returns {Promise<DatabaseResult>} An object containing either `data` (user object or null) and `error` (null or error message).
 *     Returns `null` if the user is not found. Throws a database connection error on failure.
 */
export async function getUserWithEmail(email: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`users\` WHERE (\`email\` = ?);`, email);

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
 * <Function>getUserWithId</Function>
 *
 * Retrieves user information from the database by user ID.
 *
 * @param {number} id - The unique identifier of the user to find.
 * @returns {Promise<DatabaseResult>} An object containing either `data` (user object or null) and `error` (null or error message).
 *     Returns `null` if no user is found with that ID. Throws a database connection error on failure.
 */
export async function getUserWithId(id: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`users\` WHERE (\`id\` = ?);`, id);

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
 * <Function>createUser</Function>
 *
 * Creates a new user account in the database.
 *
 * @param {string} email - The user's unique email address.
 * @param {string} hashedPassword - The password hash for the account (password should be hashed before calling).
 * @param {string} fistName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} phone - The user's phone number.
 * @param {string} address - The user's physical address.
 * @param {string} pictureUrl - URL to the user's profile picture (optional).
 * @param {('user'|'member'|'admin')} type - The account type (default: 'user'). Valid values are 'user', 'member', or 'admin'.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error on failure.
 */
export async function createUser(email: string, hashedPassword: string, fistName: string, lastName: string, address: string, phone: string, pictureUrl: string, type: "user" | "member" | "admin" = "user"): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(
            `INSERT INTO \`zmt\`.\`users\` (\`email\`, \`password\`, \`firstName\`, \`lastName\`, \`phone\`, \`address\`, \`type\`, \`picture\`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [email, hashedPassword, fistName, lastName, phone, address, type, pictureUrl],
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
 * <Function>setNewPassword</Function>
 *
 * Sets a new password hash for the specified email address.
 *
 * @param {string} email - The email address of the account whose password will be changed.
 * @param {string} hashedPassword - The new password hash to store in the database (password should be hashed before calling).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that email or on failure.
 */
export async function setNewPassword(email: string, hashedPassword: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`password\` = ? WHERE (\`email\` = ?);`, [hashedPassword, email]);

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
 * <Function>setUserType</Function>
 *
 * Updates the user type (role) for the specified email address.
 *
 * @param {string} email - The email address of the user whose role will be changed.
 * @param {('user'|'member'|'admin')} type - The new user type. Valid values are 'user', 'member', or 'admin'.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that email or on failure.
 */
export async function setUserType(email: string, type: "user" | "member" | "admin"): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`type\` = ? WHERE \`email\` = ?;`, [type, email]);

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
 * <Function>getAllUsers</Function>
 *
 * Retrieves all users from the database (typically for admin purposes).
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all user objects) and `error` (null or error message). Throws a database connection error on failure.
 */
export async function getAllUsers(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`users\`;`);

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
 * <Function>getAllUserEmails</Function>
 *
 * Retrieves all email addresses from the users table (useful for mailing list operations).
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of user emails) and `error` (null or error message). Throws a database connection error on failure.
 */
export async function getAllUserEmails(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT email from \`zmt\`.\`users\`;`);

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
 * <Function>deleteUserWithId</Function>
 *
 * Deletes a user account from the database by user ID.
 *
 * @param {number} id - The unique identifier of the user to delete.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that ID or on failure.
 */
export async function deleteUserWithId(id: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`DELETE FROM \`zmt\`.\`users\` WHERE \`id\` = ?;`, [id]);

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
 * <Function>setNewEmailWithId</Function>
 *
 * Changes the email address for a user by their ID.
 *
 * @param {number} id - The unique identifier of the user whose email will be changed.
 * @param {string} email - The new email address to set for this user.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that ID or on failure.
 */
export async function setNewEmailWithId(id: number, email: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`email\` = ? WHERE (\`id\` = ?);`, [email, id]);

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
 * <Function>setNewPasswordWithId</Function>
 *
 * Changes the password hash for a user by their ID.
 *
 * @param {number} id - The unique identifier of the user whose password will be changed.
 * @param {string} password - The new hashed password to set for this user (password should be hashed before calling).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that ID or on failure.
 */
export async function setNewPasswordWithId(id: number, password: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`password\` = ? WHERE (\`id\` = ?);`, [password, id]);

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
 * <Function>setNewFirstNameWithId</Function>
 *
 * Changes the first name for a user by their ID.
 *
 * @param {number} id - The unique identifier of the user whose name will be changed.
 * @param {string} firstName - The new first name to set for this user.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that ID or on failure.
 */
export async function setNewFirstNameWithId(id: number, firstName: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`firstName\` = ? WHERE (\`id\` = ?);`, [firstName, id]);

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
 * <Function>setNewLastNameWithId</Function>
 *
 * Changes the last name for a user by their ID.
 *
 * @param {number} id - The unique identifier of the user whose name will be changed.
 * @param {string} lastName - The new last name to set for this user.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that ID or on failure.
 */
export async function setNewLastNameWithId(id: number, lastName: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`lastName\` = ? WHERE (\`id\` = ?);`, [lastName, id]);

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
 * <Function>setNewPhoneNumberWithId</Function>
 *
 * Changes the phone number for a user by their ID.
 *
 * @param {number} id - The unique identifier of the user whose phone will be changed.
 * @param {string} phone - The new phone number to set for this user.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that ID or on failure.
 */
export async function setNewPhoneNumberWithId(id: number, phone: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`phone\` = ? WHERE (\`id\` = ?);`, [phone, id]);

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
 * <Function>setNewAddressWithId</Function>
 *
 * Changes the physical address for a user by their ID.
 *
 * @param {number} id - The unique identifier of the user whose address will be changed.
 * @param {string} address - The new physical address to set for this user.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that ID or on failure.
 */
export async function setNewAddressWithId(id: number, address: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`address\` = ? WHERE (\`id\` = ?);`, [address, id]);

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
 * <Function>setUserTypeWithId</Function>
 *
 * Changes the user type (role) for a user by their ID.
 *
 * @param {number} id - The unique identifier of the user whose role will be changed.
 * @param {('user'|'member'|'admin')} type - The new user type to set. Valid values are 'user', 'member', or 'admin'.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that ID or on failure.
 */
export async function setUserTypeWithId(id: number, type: "user" | "member" | "admin"): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`type\` = ? WHERE (\`id\` = ?);`, [type, id]);

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
 * <Function>setNewProfilePictureWithId</Function>
 *
 * Changes the profile picture URL for a user by their ID.
 *
 * @param {number} id - The unique identifier of the user whose profile will be updated.
 * @param {string} pictureUrl - The URL of the new profile picture to set.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no user is found with that ID or on failure.
 */
export async function setNewProfilePictureWithId(id: number, pictureUrl: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`users\` SET \`picture\` = ? WHERE (\`id\` = ?);`, [pictureUrl, id]);

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
