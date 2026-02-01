import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";
import { BlogContent, DatabaseResult } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";

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
 * Retrieves the latest X blog titles from the database, ordered by descending blog ID.
 *
 * @param {number} x - The number of latest blog titles to retrieve.
 *
 * @returns {Promise<DatabaseResult>} A promise that resolves to a `DatabaseResult` object containing the blog data or an error.
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

export async function updateBlog(originalTitle: string, blog: BlogContent): Promise<DatabaseResult> {
    try {
        const [result, _fields]: [RowDataPacket[], FieldPacket[]] = await connection.query(`UPDATE \`zmt\`.\`blogs\` SET \`title\` = ?, \`author\` = ?, \`data\` = ?, date = CURRENT_TIMESTAMP WHERE (\`title\` = ?);`, [blog.metadata.title, blog.metadata.author, JSON.stringify(blog), originalTitle]);

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
