import mysql from "mysql2";
import { CONFIG } from "../config";

const connection = mysql
    .createPool({
        host: CONFIG.MYSQL_HOST,
        user: CONFIG.MYSQL_USER,
        password: CONFIG.MYSQL_PASSWORD,
        database: CONFIG.MYSQL_SCHEMA,
        port: CONFIG.MYSQL_PORT,
    })
    .promise();

export default connection;
