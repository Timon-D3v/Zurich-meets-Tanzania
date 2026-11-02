import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { DatabaseResult, NewsContent } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>getNews</Function>
 *
 * Retrieves a specific news article by its unique database ID for editing, previewing, or viewing detail.
 * Fetches complete news content including title, subtitle, body, published date, and status flags from the database.
 * Only returns results if exactly one news item with matching ID exists; otherwise returns empty result.
 * Useful for CMS article pages, news archives, or admin content management systems.
 *
 * @param {number} id - The unique identifier of the news article to fetch.
 * @returns {Promise<DatabaseResult>} An object containing `data` (array with zero or one news object if found) and `error` (null or error message). Logs errors to console on failure or during database queries. Throws no explicit errors.
 */
export async function getNews(id: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`news\` WHERE \`id\` = ?`, [id]);

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
 * <Function>getLatestNews</Function>
 *
 * Retrieves the most recent news article from the database ordered by ID descending (latest first).
 * Uses LIMIT 1 to efficiently fetch only the newest published news item without loading all records.
 * Useful for homepage news tickers, sidebar widgets, or "latest news" page sections.
 * If no news exists in the database, returns an empty data array with null error.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array with most recent news article or empty) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getLatestNews(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`news\` ORDER BY \`id\` DESC LIMIT 1;`);

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
 * <Function>getLastXNewsIds</Function>
 *
 * Retrieves the IDs of the most recent news articles by selecting top N records from database.
 * Useful for creating pagination, article lists, or displaying recent news previews without full content loading.
 * WARNING: This function uses parameterized query in production code but here it interpolates number directly - ensure input validation elsewhere if used with untrusted data.
 *
 * @param {number} numberOfNews - The count of latest news IDs to fetch (determines LIMIT clause).
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of news ID objects) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getLastXNewsIds(numberOfNews: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`id\` from \`zmt\`.\`news\` ORDER BY \`id\` DESC LIMIT ${numberOfNews};`);

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
 * <Function>getAllNews</Function>
 *
 * Retrieves all news articles from the database for comprehensive listings, archives, or bulk operations.
 * Fetches every record in the news table including title, subtitle, body content, publication date, author information, and status fields.
 * Useful when displaying complete archives, generating RSS feeds, or performing batch updates on multiple news items simultaneously.
 * Returns all articles ordered by default database sort order (by ID).
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all news objects) and `error` (null or error message). Logs errors to console on failure. Throws no explicit errors.
 */
export async function getAllNews(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`news\``);

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
 * <Function>createNews</Function>
 *
 * Creates a new news article record in the database by inserting JSON-encoded content into a JSON column.
 * Stores title, subtitle, body content, author information, publication date, and various status flags for CMS workflow tracking.
 * Useful for admin content creation when publishing blog posts, announcements to homepage, or archival entries.
 * The `data` field stores complete article as JSON string parsed later for display/editing operations.
 *
 * @param {NewsContent} newsContent - An object containing the complete news article data including title, subtitle, body content array with rich text/markdown elements, and metadata fields.
 * @returns {Promise<DatabaseResult>} An object containing database query result object and null on successful insertion. Returns error message if database write fails or connection is unavailable. Logs errors to console. Throws no explicit errors.
 */
export async function createNews(newsContent: NewsContent): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`news\` (\`data\`) VALUES (?);`, [JSON.stringify(newsContent)]);

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
 * <Function>updateNews</Function>
 *
 * Updates an existing news article in the database at its unique ID with new content.
 * Replaces entire JSON-encoded `data` field with updated newsContent object serialized to string.
 * Useful for editors modifying published articles, updating content before re-publishing, or correcting errors.
 * Note: This performs a full row update; use carefully to avoid data loss from replacing complete JSON structure.
 *
 * @param {number} newsId - The unique identifier of the news article to update.
 * @param {NewsContent} newsContent - Complete updated news content object including title, subtitle, body, and metadata fields. JSON will be re-serialized on insertion.
 * @returns {Promise<DatabaseResult>} An object containing database query result object and null on successful update. Returns error message if database write fails or article not found by ID. Logs errors to console. Throws no explicit errors.
 */
export async function updateNews(newsId: number, newsContent: NewsContent): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`news\` SET \`data\` = ? WHERE \`id\` = ?;`, [JSON.stringify(newsContent), newsId]);

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
