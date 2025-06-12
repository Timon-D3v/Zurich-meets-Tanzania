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
};
