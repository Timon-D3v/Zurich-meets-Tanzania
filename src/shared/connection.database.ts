import mysql from "mysql2/promise";
import { CONFIG } from "../config";
import { sleep } from "./utils";

const connection = mysql.createPool({
    host: CONFIG.MYSQL_HOST,
    user: CONFIG.MYSQL_USER,
    password: CONFIG.MYSQL_PASSWORD,
    database: CONFIG.MYSQL_SCHEMA,
    port: CONFIG.MYSQL_PORT,
});

export default connection;

/**
 * <Function>waitForDatabase</Function>
 * 
 * Retries database connection tests until successful or maximum retries are exhausted.
 * Automatically waits between attempts (configurable delay) and logs retry progress for monitoring.
 * Useful during application startup to ensure MySQL pool is ready before processing requests.
 * Throws an error if database connection cannot be established within retry limit.
 * 
 * @param {number} retryDelayMs - Milliseconds to wait between retry attempts (default: 1000ms). Adjust for faster or slower probing behavior.
 * @param {number} maxRetries - Maximum number of retry attempts before giving up (default: 60).
 * @returns {Promise<void>} Resolves successfully when database becomes reachable and healthy. Never throws unless max retries exhausted. Logs warnings/info to console during retries.
 */
export async function waitForDatabase(retryDelayMs = 1000, maxRetries = 60): Promise<void> {
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            await connection.query("SELECT 1");

            console.info("Database connection is healthy.");
            return;
        } catch (error) {
            attempt++;

            console.warn(`Database is not ready. Retrying in ${retryDelayMs}ms... (attempt ${attempt}/${maxRetries})`);

            await sleep(retryDelayMs);
        }
    }

    throw new Error("Database did not become available.");
}
