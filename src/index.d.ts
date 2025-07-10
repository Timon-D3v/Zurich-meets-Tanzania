import { RowDataPacket } from "mysql2";

export type Config = {
    ENV: "dev" | "prod";
    HOST: string;
    PORT: number;
    SESSION_SECRET: string;
    MYSQL_HOST: string;
    MYSQL_PORT: number;
    MYSQL_USER: string;
    MYSQL_PASSWORD: string;
    MYSQL_SCHEMA: string;
    MAILJET_PUBLIC_KEY: string;
    MAILJET_PRIVATE_KEY: string;
    ORIGIN: string;
};

export type PublicConfig = {
    UNIKAT_URL: string;
    FACEBOOK_URL: string;
    INSTAGRAM_URL: string;
    PROGRAMMER_URL: string;

    ERROR: {
        NO_CONNECTION_TO_DATABASE: string
    }
};

export type NavLink = {
    href: string;
    label: string;
    external?: boolean;
    onClick?: Function;
};

export type NavLinkPicture = {
    src: string;
    alt: string;
};

export type DatabaseResult = {
    data: RowDataPacket[] | RowDataPacket | null,
    error: null | string
}