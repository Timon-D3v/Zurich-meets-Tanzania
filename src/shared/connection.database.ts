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
