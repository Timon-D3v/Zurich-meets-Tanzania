import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult, StaticSite } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>getStaticSite</Function>
 * 
 * Retrieves a static site content page from the database using its title identifier.
 * Only accepts whitelisted titles corresponding to predefined CMS sections (vision, board, beginning, finances, income-statement, general-meeting, statutes, zurich-meets-tanzania, tanzania-meets-zurich, mbuzi, gynecology, meducation, bajaji, cardiology, surgery, history).
 * Useful for dynamic route handlers or CMS content retrieval when visitor accesses a dedicated webpage section by static site slug.
 * If requesting outside whitelisted titles, will handle accordingly (either redirect or return 404 depending on application logic calling this function).
 * 
 * @param {title} title - The static site identifier string matching one of the predefined page titles in database enumeration list. Can be any of: "vision", "board", "beginning", "finances", "income-statement", "general-meeting", "statutes", "zurich-meets-tanzania", "tanzania-meets-zurich", "mbuzi", "gynecology", "meducation", "bajaji", "cardiology", "surgery", or "history".
 * @returns {Promise<DatabaseResult>} An object containing `data` (static site content object or null if not found) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getStaticSite(
    title:
        "vision" | "board" | "beginning" | "finances" | "income-statement" | "general-meeting" | "statutes" | "zurich-meets-tanzania" | "tanzania-meets-zurich" | "mbuzi" | "gynecology" | "meducation" | "bajaji" | "cardiology" | "surgery" | "history",
): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`subpages\` WHERE (\`title\` = ?);`, [title]);

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
 * <Function>getAllStaticSites</Function>
 * 
 * Retrieves all static site content pages from the database for complete listings, navigation menus, or overview displays.
 * Fetches every record in subpages table including title, slug, author, publication date, status flags, and JSON-encoded content field.
 * Useful with dropdown generation, breadcrumbs, sitemaps, or when displaying multiple CMS pages on a directory/listing view page.
 * Returns ordered list by default database sort order (typically ID ascending).
 * 
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all static site objects) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getAllStaticSites(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * FROM \`zmt\`.\`subpages\`;`);

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
 * <Function>updateStaticSite</Function>
 * 
 * Updates an existing static site content record in the database using its whitelisted title identifier.
 * Stores updated JSON-encoded content in `data` field and automatically updates timestamp `date` to CURRENT_TIMESTAMP.
 * Only accepts predefined titles from enumeration list ensuring consistency with CMS routing and navigation structure.
 * Used by admin editors or dynamic routes when updating page content, fixing errors, or republishing modified static site pages.
 * 
 * @param {title} title - The static site identifier string matching one of the predefined page titles in database whitelist enumeration (vision, board, beginning, finances, income-statement, general-meeting, statutes, zurich-meets-tanzania, tanzania-meets-zurich, mbuzi, gynecology, meducation, bajaji, cardiology, surgery, history).
 * @param {StaticSite} site - Complete updated static site object data including title, slug, author, publication date, status flags, and JSON-encoded rich content body fields ready for storage in database.
 * @returns {Promise<DatabaseResult>} An object containing database query result object and null on successful write-update. Returns error message if database operation fails or connection unavailable. Logs errors to console. Throws no explicit errors.
 */
export async function updateStaticSite(
    title:
        "vision" | "board" | "beginning" | "finances" | "income-statement" | "general-meeting" | "statutes" | "zurich-meets-tanzania" | "tanzania-meets-zurich" | "mbuzi" | "gynecology" | "meducation" | "bajaji" | "cardiology" | "surgery" | "history",
    site: StaticSite,
): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`subpages\` SET \`data\` = ?, date = CURRENT_TIMESTAMP WHERE (\`title\` = ?);`, [JSON.stringify(site), title]);

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
