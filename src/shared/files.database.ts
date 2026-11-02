import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { PUBLIC_CONFIG } from "../publicConfig";
import { DatabaseResult } from "..";

/**
 * <Function>getAllLocalFiles</Function>
 * 
 * Retrieves all local file records from the database.
 * Returns complete file metadata including uuid, mimeType, filename, folderId for storage management operations.
 * Useful for listing stored files in admin panel or generating file system views. Always fetches full `files` table content.
 * 
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all local file records) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllLocalFiles(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`files\`;`);

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
 * <Function>getAllLocalFilenames</Function>
 * 
 * Retrieves all file names from the local storage database.
 * Returns only filename field for fast loading of file name lists (e.g., dropdowns, previews).
 * Useful for navigation menus, file selectors, or bulk operations without full metadata fetching. Results may have duplicates if multiple files share same base name in different folders.
 * 
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all filename strings) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllLocalFilenames(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`filename\` FROM \`zmt\`.\`files\`;`);

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
 * <Function>getLocalFileByName</Function>
 * 
 * Retrieves a local file record by its filename from the database.
 * Useful for looking up file metadata when only filename is known (e.g., from URL or form submission).
 * Returns complete file record with uuid, mimeType, folderId etc. Returns empty result if no file found with matching name.
 * 
 * @param {string} name - The exact filename to retrieve from the database table. Must match stored value exactly (case-sensitive).
 * @returns {Promise<DatabaseResult>} An object containing `data` (the file record or null) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getLocalFileByName(name: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`files\` WHERE \`filename\` = ?`, [name]);

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
 * <Function>addLocalFile</Function>
 * 
 * Adds a new file record to the local storage database.
 * Stores uuid and mimeType for external DelivAPI CDN or internal file references. Used when initial upload complete but metadata needs tracking.
 * Does NOT store filename at insertion point; filename is updated via `updateLocalFilename()` after processing. Returns success with inserted ID.
 * 
 * @param {string} uuid - The unique identifier/UUID of the file in storage system (e.g., DelivAPI CDN path component).
 * @param {string} mimeType - The MIME type of the uploaded file for display and download handling (e.g., "image/png", "application/pdf").
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if insertion fails or on failure. Logs errors to console.
 */
export async function addLocalFile(uuid: string, mimeType: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`files\` (\`uuid\`, \`mimeType\`) VALUES (?, ?)`, [uuid, mimeType]);

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
 * <Function>deleteLocalFile</Function>
 * 
 * Deletes a local file record from the database by its UUID.
 * Completely removes the file metadata and associations. Use for cleanup when file deleted via CDN or external storage system.
 * Useful for garbage collection of old files after manual deletion from DelivAPI or expiration policies. Returns success with affected row count.
 * 
 * @param {string} uuid - The unique identifier/UUID of the file record to delete from database. Must match stored UUID exactly for successful removal.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no file found with that UUID or on failure. Logs errors to console.
 */
export async function deleteLocalFile(uuid: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`DELETE FROM \`zmt\`.\`files\` WHERE \`uuid\` = ?`, [uuid]);

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
 * <Function>updateLocalFileMimeType</Function>
 * 
 * Updates the MIME type of a file record in the database by its UUID.
 * Useful when initial MIME detection was incorrect or content changed during processing (e.g., chunked re-upload).
 * Only updates if UUID matches existing record. Returns success with updated row count.
 * 
 * @param {string} uuid - The unique identifier/UUID of the file whose MIME type will be updated.
 * @param {string} mimeType - The new MIME type to set for this file (e.g., "image/png", "application/pdf").
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no file found with that UUID or on failure. Logs errors to console.
 */
export async function updateLocalFileMimeType(uuid: string, mimeType: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`files\` SET \`mimeType\` = ? WHERE \`uuid\` = ?`, [mimeType, uuid]);

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
 * <Function>updateLocalFilename</Function>
 * 
 * Updates the filename of a file record in the database by its UUID.
 * Useful after file extraction or when display name should differ from stored filename. Does not rename physical files, just metadata.
 * Returns success with updated row count.
 * 
 * @param {string} uuid - The unique identifier/UUID of the file whose filename will be updated.
 * @param {string} filename - The new filename to set for this file in the database (display name or internal reference).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no file found with that UUID or on failure. Logs errors to console.
 */
export async function updateLocalFilename(uuid: string, filename: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`files\` SET \`filename\` = ? WHERE \`uuid\` = ?`, [filename, uuid]);

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
 * <Function>updateLocalFoldername</Function>
 * 
 * Updates the name of a folder in the database by its ID.
 * Renames folder display name for internal organization or user-facing labels. Only affects metadata, not directory structure.
 * Useful when folder naming needs updating after creation or from admin panel operations.
 * 
 * @param {number} id - The unique identifier/ID of the folder whose name will be updated in the database.
 * @param {string} foldername - The new folder name to set for this folder in the database (display label).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no folder found with that ID or on failure. Logs errors to console.
 */
export async function updateLocalFoldername(id: number, foldername: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`folders\` SET \`foldername\` = ? WHERE \`id\` = ?`, [foldername, id]);

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
 * <Function>deleteLocalFolder</Function>
 * 
 * Deletes a folder record from the database by its ID.
 * Removes folder metadata including all child file references that store folderId. Use with caution as this affects organization structure.
 * Useful for cleanup, reorganization, or removing empty folders after files have been moved/deleted externally.
 * Note: Files themselves remain in storage; only folder association is removed.
 * 
 * @param {number} id - The unique identifier/ID of the folder to delete from database.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no folder found with that ID or on failure. Logs errors to console.
 */
export async function deleteLocalFolder(id: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`DELETE FROM \`zmt\`.\`folders\` WHERE \`id\` = ?`, [id]);

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
 * <Function>getAllLocalFolders</Function>
 * 
 * Retrieves all local folders from the database.
 * Returns complete folder metadata including id, foldername, and parent folderId (folderId). Useful for displaying directory tree or navigation menus on website pages.
 * Includes nested structure data via foreign key relationships. Throws database connection error on failure. Logs errors to console.
 * 
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all local folder records) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllLocalFolders(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`folders\`;`);

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
 * <Function>createLocalFolder</Function>
 * 
 * Creates a new folder record in the database for organizing files.
 * Stores folder name and optional parent folderId (set to null for root-level or undefined if omitted). Used during site initialization or admin panel folder operations.
 * Returns success with inserted ID for potential nested creation or tracking.
 * 
 * @param {string} foldername - The display name of the new folder.
 * @param {number | null} folderId - Optional parent folder ID (null for root level). If not specified, defaults to null/undefined for top-level folder.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if insertion fails or on failure. Logs errors to console.
 */
export async function createLocalFolder(foldername: string, folderId: number | null): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`folders\` (\`foldername\`, \`folderId\`) VALUES (?, ?)`, [foldername, folderId]);

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
 * <Function>moveFilesToFolder</Function>
 * 
 * Moves multiple files to a new folder by updating their folderId in the database.
 * Uses SQL IN clause to batch-update multiple file records at once for efficiency.
 * Only updates metadata (folder association), actual files stay in storage. Useful for bulk reorganization or user upload cleanup operations.
 * Note: If `fileUuids` array contains duplicates, query might fail; ensure distinct UUIDs before calling.
 * 
 * @param {string[]} fileUuids - Array of unique file UUID strings whose folder membership will be updated. Each UUID must match existing record exactly.
 * @param {number | null} targetFolderId - The destination parent folder ID to move files into. Set to `null` for root level if no target exists yet.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if update fails, UUIDs invalid, or batch query syntax issues occur. Logs errors to console.
 */
export async function moveFilesToFolder(fileUuids: string[], targetFolderId: number | null): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`files\` SET \`folderId\` = ? WHERE \`uuid\` IN (${fileUuids.map(() => "?").join(", ")})`, [targetFolderId, ...fileUuids]);

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
 * <Function>moveFoldersToFolder</Function>
 * 
 * Moves multiple folders to a new parent folder by updating their parentId in the database.
 * Uses SQL IN clause to batch-update multiple folder records at once for efficiency.
 * Only updates nested structure metadata, does not relocate files themselves. Useful for bulk reorganization or admin panel operations.
 * Note: If `folderIds` array contains duplicates, query might fail; ensure distinct IDs before calling.
 * 
 * @param {number[]} folderIds - Array of unique folder IDs whose parent relationship will be updated. Each ID must match existing folder record exactly.
 * @param {number | null} targetFolderId - The destination parent folder ID to move folders into. Set to `null` for root level if relocating all folders upward.
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if update fails, IDs invalid, or batch query syntax issues occur. Logs errors to console.
 */
export async function moveFoldersToFolder(folderIds: number[], targetFolderId: number | null): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`folders\` SET \`folderId\` = ? WHERE \`id\` IN (${folderIds.map(() => "?").join(", ")})`, [targetFolderId, ...folderIds]);

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
