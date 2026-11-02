import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { BlogContent, DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

/**
 * <Function>getBlog</Function>
 *
 * Retrieves a blog post by its title from the database.
 * Used for displaying specific blog content or when fetching a blog via title lookup.
 * Includes complete blog metadata and content data. Returns empty result if not found.
 *
 * @param {string} title - The exact title of the blog to retrieve.
 * @returns {Promise<DatabaseResult>} An object containing `data` (the blog post or null) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getBlog(title: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`blogs\` WHERE \`title\` = ?`, [title]);

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
 * <Function>getAllBlogs</Function>
 *
 * Retrieves all blog posts from the database.
 * Returns complete blog data with metadata and content for each post.
 * Useful for admin panel views or displaying full blog archive lists.
 * Results are ordered by descending blog ID (newest first).
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of all blog posts) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllBlogs(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT * from \`zmt\`.\`blogs\``);

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
 * <Function>getLastXBlogTitles</Function>
 *
 * Retrieves the latest X blog titles from the database, ordered by descending blog ID.
 * Useful for displaying a list of recent blog posts (e.g., on homepage sidebar or footer).
 * Only the title field is fetched to enable fast listing without full content loading.
 *
 * @param {number} x - The number of latest blog titles to retrieve.
 * @returns {Promise<DatabaseResult>} A promise that resolves to a `DatabaseResult` object containing the blog data or an error. Logs errors to console.
 *
 * @example
 * ```typescript
 * const result = await getLastXBlogTitles(5);
 * if (result.error) {
 *   // handle error
 * } else {
 *   // process result.data
 * }
 * ```
 */
export async function getLastXBlogTitles(x: number): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`title\` from \`zmt\`.\`blogs\` ORDER BY \`id\` DESC LIMIT ${x};`);

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
 * <Function>getAllBlogTitles</Function>
 *
 * Retrieves all blog titles from the database, ordered by descending blog ID.
 * Returns only title field for fast loading as a list of available blog posts.
 * Useful for navigation menus, footer links, or dropdown selectors showing all blogs.
 *
 * @returns {Promise<DatabaseResult>} An object containing `data` (array of blog titles) and `error` (null or error message). Throws a database connection error on failure. Logs errors to console.
 */
export async function getAllBlogTitles(): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`SELECT \`title\` from \`zmt\`.\`blogs\` ORDER BY \`id\` DESC;`);

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
 * <Function>createBlog</Function>
 *
 * Creates a new blog post entry in the database.
 * Stores title, author, content data as JSON string, and automatically sets current timestamp as publish date.
 * Used when authors create new blog posts via admin interface or API calls. Returns success result with inserted ID.
 *
 * @param {string} title - The blog post title displayed on website lists and pages.
 * @param {BlogContent} blog - Blog content object containing metadata (author) and data fields for the blog body, image URLs, etc.
 * @returns {Promise<DatabaseResult>} An object containing database query result (INSERT ID) and null on success. Throws a database connection error if insertion fails or on failure. Logs errors to console.
 */
export async function createBlog(title: string, blog: BlogContent): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`INSERT INTO \`zmt\`.\`blogs\` (\`title\`, \`author\`, \`date\`, \`data\`) VALUES (?, ?, CURRENT_TIMESTAMP, ?);`, [
            title,
            blog.metadata.author,
            JSON.stringify(blog),
        ]);

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
 * <Function>updateBlog</Function>
 *
 * Updates an existing blog post by its original title, overwriting all content fields.
 * Used to edit blog posts from admin panel or when corrections are needed.
 * Sets current timestamp as new publish date. Only affects the blog matching the given title.
 *
 * @param {string} originalTitle - The exact original title of the blog to update. Use with caution as this must match previous insert exactly.
 * @param {BlogContent} blog - New blog content object containing updated metadata and data fields.
 * @returns {Promise<DatabaseResult>} An object containing database query result (updated row count) and null on success. Throws a database connection error if update fails or no blog found with that title. Logs errors to console.
 */
export async function updateBlog(originalTitle: string, blog: BlogContent): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`blogs\` SET \`title\` = ?, \`author\` = ?, \`data\` = ?, \`date\` = CURRENT_TIMESTAMP WHERE (\`title\` = ?);`, [
            blog.metadata.title,
            blog.metadata.author,
            JSON.stringify(blog),
            originalTitle,
        ]);

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
 * <Function>deleteBlog</Function>
 *
 * Deletes a blog post from the database by its title.
 * Completely removes the blog entry and associated data. Use with extreme caution as this is irreversible.
 * Useful for removing outdated, incorrect, or spam blog posts via admin interface.
 *
 * @param {string} title - The exact title of the blog to delete. Must match previously stored title exactly (case-sensitive).
 * @returns {Promise<DatabaseResult>} An object containing database query result and null on success. Throws a database connection error if no blog is found with that title or on failure. Logs errors to console.
 */
export async function deleteBlog(title: string): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`DELETE FROM \`zmt\`.\`blogs\` WHERE (\`title\` = ?);`, [title]);

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
