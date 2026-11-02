import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { PUBLIC_CONFIG } from "../publicConfig";
import { DatabaseResult, DelivApiFile } from "..";

/**
 * <Function>getLastXGalleryTitles</Function>
 *
 * Retrieves the latest X gallery titles from the database, ordered by descending gallery ID.
 * Useful for displaying a list of recent galleries (e.g., on homepage sidebar or footer).
 * Only the title field is fetched to enable fast listing without full content loading.
 *
 * @param {number} x - The number of latest gallery titles to retrieve.
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of gallery titles) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getLastXGalleryTitles(x: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`title\` from \`zmt\`.\`gallery\` ORDER BY \`id\` DESC LIMIT ${x};`);

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
 * <Function>getAllGalleryTitles</Function>
 *
 * Retrieves all gallery titles from the database.
 * Returns complete gallery data with metadata and content for each gallery.
 * Useful for displaying full gallery archive lists or admin panel views. Results ordered by descending gallery ID (newest first).
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of gallery records) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllGalleryTitles(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`title\` from \`zmt\`.\`gallery\`;`);

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
 * <Function>getAllGalleryTitlesAndSubtitles</Function>
 *
 * Retrieves all gallery titles and subtitles from the database.
 * Returns only title and subtitle fields for fast loading of navigation menus, dropdowns, or preview lists.
 * Useful for website footers, sidebars, or admin panel quick views without full content fetch. Results ordered by descending gallery ID.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of objects with title and subtitle strings) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllGalleryTitlesAndSubtitles(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`title\`, \`subtitle\` from \`zmt\`.\`gallery\`;`);

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
 * <Function>getGalleryWithTitle</Function>
 *
 * Retrieves a specific gallery by its title from the database.
 * Returns complete gallery record with data field containing image URLs and metadata, plus full gallery row from joined tables.
 * Only matches galleries with exact case-sensitive title as stored previously. Returns empty result if no matching gallery found.
 *
 * @param {string} title - The exact title of the gallery to retrieve (must match inserted value exactly, case-sensitive).
 * @returns {Promise<DatabaseResult>} An object containing `data` (the gallery record or null) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getGalleryWithTitle(title: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`gallery\` WHERE \`title\` = ?`, [title]);

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
 * <Function>createGallery</Function>
 *
 * Creates a new gallery entry in the database with initial empty image array.
 * Stores title, subtitle, and data as JSON array of file objects (initialized as empty). Used when admin adds first images later.
 * Returns success result with inserted ID for subsequent `updateGalleryImages()` calls. Useful during site initialization or bulk gallery creation.
 *
 * @param {string} title - The gallery main title displayed on website lists and pages.
 * @param {string} subtitle - Optional subtitle/tagline for the gallery (displayed under main title).
 * @returns {Promise<DatabaseResult>} An object containing database query result (INSERT ID) and null on success. Throws a database connection error if insertion fails or on failure. Logs errors to console.
 */
export async function createGallery(title: string, subtitle: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`gallery\` (\`title\`, \`subtitle\`, \`data\`) VALUES (?, ?, '[]');`, [title, subtitle]);

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
 * <Function>removeGallery</Function>
 *
 * Deletes a gallery entry from the database by its title.
 * Completely removes the gallery record and associated image data arrays. Use with caution as this is irreversible.
 * Useful for removing outdated, incorrect, or spam galleries via admin interface after content cleanup.
 *
 * @param {string} title - The exact title of the gallery to delete. Must match previously stored value exactly (case-sensitive).
 * @returns {Promise<DatabaseResult>} An object containing database query result (affected rows) and null on success. Throws a database connection error if no gallery found with that title or on failure. Logs errors to console.
 */
export async function removeGallery(title: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`DELETE FROM \`zmt\`.\`gallery\` WHERE \`title\` = ?`, [title]);

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
 * <Function>updateGalleryImages</Function>
 *
 * Updates a gallery's image collection by replacing the data field with new image files.
 * Stores JSON string array of DelivApiFile objects including CDN URLs, MIME types, and file metadata.
 * Useful for bulk upload after admin panel drag-and-drop or API file selection operations.
 * Sets timestamp to CURRENT_TIMESTAMP on each update for tracking recent gallery modifications.
 *
 * @param {string} title - The gallery title whose images will be updated (must match existing gallery record).
 * @param {DelivApiFile[]} urls - Array of DelivApiFile objects containing CDN URLs, MIME types, and image metadata to store in gallery.
 * @returns {Promise<DatabaseResult>} An object containing database query result (updated row count) and null on success. Throws a database connection error if update fails or no gallery found with that title. Logs errors to console.
 */
export async function updateGalleryImages(title: string, urls: DelivApiFile[]): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`gallery\` SET \`date\` = CURRENT_TIMESTAMP, \`data\` = ? WHERE \`title\` = ?;`, [JSON.stringify(urls), title]);

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
 * <Function>updateGalleryDetails</Function>
 *
 * Updates a gallery's title and subtitle fields in the database.
 * Can be used to rename galleries after creation or correct typos in metadata display.
 * Useful for admin operations when correcting gallery name or changing campaign/tagline text.
 * Note: Does NOT update images; only modifies title, subtitle, and timestamp (CURRENT_TIMESTAMP set on each call).
 *
 * @param {string} title - The current exact title of the gallery that will be updated (must match existing record exactly).
 * @param {string} newTitle - The new gallery main title to replace old title with.
 * @param {string} newSubtitle - The new subtitle/tagline for this gallery.
 * @returns {Promise<DatabaseResult>} An object containing database query result (updated row count) and null on success. Throws a database connection error if no gallery found or update fails. Logs errors to console.
 */
export async function updateGalleryDetails(title: string, newTitle: string, newSubtitle: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`gallery\` SET \`date\` = CURRENT_TIMESTAMP, \`title\` = ?, \`subtitle\` = ? WHERE \`title\` = ?;`, [newTitle, newSubtitle, title]);

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
