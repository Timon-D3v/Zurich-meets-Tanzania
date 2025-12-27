import dotenv from "dotenv";
import type { Config } from ".";

dotenv.config();

export const CONFIG: Config = {
    ENV: process.env["ENV"] as "dev" | "prod",
    HOST: process.env["HOST"] as string,
    PORT: Number(process.env["PORT"]),

    SESSION_SECRET: process.env["SESSION_SECRET_KEY"] as string,

    MYSQL_HOST: process.env["MYSQL_HOST"] as string,
    MYSQL_PORT: Number(process.env["MYSQL_PORT"]),
    MYSQL_USER: process.env["MYSQL_USER"] as string,
    MYSQL_PASSWORD: process.env["MYSQL_PW"] as string,
    MYSQL_SCHEMA: process.env["MYSQL_DB"] as string,

    MAILJET_PUBLIC_KEY: process.env["MAILJET_PUBLIC_KEY"] as string,
    MAILJET_PRIVATE_KEY: process.env["MAILJET_PRIVATE_KEY"] as string,

    ORIGIN: process.env["ORIGIN"] as string,

    EMAIL_SENDER_ADDRESS: process.env["EMAIL_SENDER_ADDRESS"] as string,
    EMAIL_SENDER_NAME: process.env["EMAIL_SENDER_NAME"] as string,

    DELIVAPI_USER: process.env["DELIVAPI_USER"] as string,
    DELIVAPI_KEY: process.env["DELIVAPI_KEY"] as string,

    PASSWORD_GOOGLE_ACCOUNT: process.env["PASSWORD_GOOGLE_ACCOUNT"] as string,
    PASSWORD_IMAGEKIT_ACCOUNT: process.env["PASSWORD_IMAGEKIT_ACCOUNT"] as string,
    PASSWORD_STRIPE_ACCOUNT: process.env["PASSWORD_STRIPE_ACCOUNT"] as string,
    PASSWORD_MAILJET_ACCOUNT: process.env["PASSWORD_MAILJET_ACCOUNT"] as string,
    PASSWORD_INFOMANIAK_ACCOUNT: process.env["PASSWORD_INFOMANIAK_ACCOUNT"] as string,

    EMAIL_GOOGLE_ACCOUNT: process.env["EMAIL_GOOGLE_ACCOUNT"] as string,
    EMAIL_IMAGEKIT_ACCOUNT: process.env["EMAIL_IMAGEKIT_ACCOUNT"] as string,
    EMAIL_INFOMANIAK_ACCOUNT: process.env["EMAIL_INFOMANIAK_ACCOUNT"] as string,
    EMAIL_STRIPE_ACCOUNT: process.env["EMAIL_STRIPE_ACCOUNT"] as string,
    EMAIL_MAILJET_ACCOUNT: process.env["EMAIL_MAILJET_ACCOUNT"] as string,

    TWO_FACTOR_AUTHENTICATION_SECRET_STRIPE_ACCOUNT: process.env["TWO_FACTOR_AUTHENTICATION_SECRET_STRIPE_ACCOUNT"] as string,
};
