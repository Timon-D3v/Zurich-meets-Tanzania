import { RowDataPacket } from "mysql2";

declare module "express-session" {
    interface SessionData {
        user: PrivateUser | null;
        isLoggedIn: boolean;
    }
}

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
    EMAIL_SENDER_ADDRESS: string;
    EMAIL_SENDER_NAME: string;
};

export type PageDescription = {
    title: string;
    description: string;
    lastUpdated: string;
};

export type PublicConfig = {
    NAME: string;
    ORIGIN: string;

    THEME_COLOR: string;

    UNIKAT_URL: string;
    FACEBOOK_URL: string;
    INSTAGRAM_URL: string;
    PROGRAMMER_URL: string;

    PERSONAS: {
        [position: string]: {
            name: string;
            email: string;
            website?: string;
            linkedIn?: string;
            github?: string;
        };
    };

    ERROR: {
        BAD_REQUEST: string;
        NO_CONNECTION_TO_DATABASE: string;
        NO_CONNECTION_TO_SERVER: string;
        NO_INTERNET_CONNECTION: string;
    };

    ROUTES: {
        TYPES: {
            HOME: string[];
            AUTH: string[];
            SECURED: string[];
            PROJECTS: string[];
            ADMIN: string[];
            CONTACT: string[];
            GENERAL: string[];
        };
        TITLES: {
            [path: `/${string}`]: PageDescription;
        };
    };

    EMAIL: {
        GREETINGS: (fistName: string, lastName: string, gender: "Herr" | "Frau" | "Divers") => string;
        GREETINGS_HTML: (greetings: string) => string;
        REGARDS: string;
        REGARDS_HTML: string;
        HEADER: string;
        FOOTER: string;
        NEWSLETTER_BODY: (preview: string) => string;
        NEWSLETTER_BODY_HTML: (preview: string) => string;
        NEWSLETTER_SUBJECT: string;
    };
};

export type NavLink = {
    href: string;
    label: string;
    external?: boolean;
    clickable?: boolean;
    onClick?: Function;
};

export type NavLinkPicture = {
    src: string;
    alt: string;
};

export type DatabaseResult = {
    data: RowDataPacket[] | RowDataPacket | null;
    error: null | string;
};

export type HeroInformation = {
    title: string;
    pictureUrl: string;
    pictureAlt: string;
    subtitle?: string;
    buttonType?: "scroll" | "url";
    buttonText?: string;
    buttonLink?: string;
};

export type HeaderNavAnchorWidthArray = [number, number, number, number, number];

export type Notification = {
    type: NotificationTypes;
    title: string;
    message: string;
    closable: boolean;
};

export type EmailPasswordCombo = {
    email: string;
    password: string;
};

export type NotificationTypes = "neutral" | "success" | "error" | "warn" | "info";

export type HTMLInputTypes = "button" | "checkbox" | "color" | "date" | "datetime" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

export type HTMLInputAutocompleteOptions =
    | "on"
    | "off"
    | "address-line1"
    | "address-line2"
    | "address-line3"
    | "address-level1"
    | "address-level2"
    | "address-level3"
    | "address-level4"
    | "street-address"
    | "country"
    | "country-name"
    | "postal-code"
    | "name"
    | "additional-name"
    | "family-name"
    | "given-name"
    | "honoric-prefix"
    | "honoric-suffix"
    | "nickname"
    | "organization-title"
    | "username"
    | "new-password"
    | "current-password"
    | "bday"
    | "bday-day"
    | "bday-month"
    | "bday-year"
    | "sex"
    | "one-time-code"
    | "organization"
    | "cc-name"
    | "cc-given-name"
    | "cc-additional-name"
    | "cc-family-name"
    | "cc-number"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-csc"
    | "cc-type"
    | "transaction-currency"
    | "transaction-amount"
    | "language"
    | "url"
    | "email"
    | "photo"
    | "tel"
    | "tel-country-code"
    | "tel-national"
    | "tel-area-code"
    | "tel-local"
    | "tel-local-prefix"
    | "tel-local-suffix"
    | "tel-extension"
    | "impp";

export interface ApiEndpointResponse {
    error: boolean;
    message: string;
}

export interface GetPublicUserDetailsApiEndpointResponse extends ApiEndpointResponse {
    data: {
        isLoggedIn: boolean;
        user: PublicUser;
    };
}

export interface DatabaseApiEndpointResponse extends ApiEndpointResponse {
    data: DatabaseResult;
}

export interface AddToNewsletterListApiEndpointResponse extends ApiEndpointResponse {
    data: {
        alreadyLoggedIn: boolean;
    };
}

export interface PublicUser {
    email: string;
    name: string;
    family_name: string;
    picture: string;
    phone: string;
    type: "user" | "member" | "admin";
    address: string;
}

export interface PrivateUser extends PublicUser {
    id: number;
    username: string; // Deprecated
    password: string; // Hashed
}

export type NewsletterSignUpRequest = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: "Herr" | "Frau" | "Divers";
    timestamp: number;
};

export type MailjetAttachment = {
    ContentType: string;
    Filename: string;
    Base64Content: string;
};
