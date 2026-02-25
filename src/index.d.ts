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

    DELIVAPI_USER: string;
    DELIVAPI_KEY: string;

    EMAIL_GOOGLE_ACCOUNT: string;
    EMAIL_IMAGEKIT_ACCOUNT: string;
    EMAIL_INFOMANIAK_ACCOUNT: string;
    EMAIL_STRIPE_ACCOUNT: string;
    EMAIL_STRIPE_READONLY_ACCOUNT: string;
    EMAIL_MAILJET_ACCOUNT: string;

    PASSWORD_GOOGLE_ACCOUNT: string;
    PASSWORD_IMAGEKIT_ACCOUNT: string;
    PASSWORD_STRIPE_ACCOUNT: string;
    PASSWORD_STRIPE_READONLY_ACCOUNT: string;
    PASSWORD_MAILJET_ACCOUNT: string;
    PASSWORD_INFOMANIAK_ACCOUNT: string;

    TWO_FACTOR_AUTHENTICATION_SECRET_STRIPE_READONLY_ACCOUNT: string;

    TIANJI_API_KEY: string;
    TIANJI_WORKSPACE_ID: string;
    TIANJI_WEBSITE_ID: string;
    TIANJI_URL: string;
};

export type PublicEnvVariables = {
    ORIGIN: string | null;
    ENV: "dev" | "prod" | null;
    DELIVAPI_USER: string | null;
};

export type PublicConfig = {
    NAME: string;

    THEME_COLOR: string;

    UNIKAT_URL: string;
    FACEBOOK_URL: string;
    INSTAGRAM_URL: string;
    PROGRAMMER_URL: string;
    CDN_URL: string;

    PRIVACY_PDF_URL: string;
    FALLBACK_IMAGE_URL: string;

    STATIC_SITES: {
        LOADING: (name: StaticSiteNames, imageUrl: string) => StaticSite;
        ERROR: (name: StaticSiteNames, imageUrl: string, message: string) => StaticSite;
    };

    BLOGS: {
        LOADING: (name: string, imageUrl: string) => Blog;
        ERROR: (name: string, imageUrl: string, message: string) => Blog;
    };

    NEWS: {
        LOADING: (imageUrl: string) => News;
        ERROR: (imageUrl: string, message: string) => News;
    };

    PERSONAS: {
        [position: string]: MetaPersonas;
    };

    ERROR: {
        INTERNAL_ERROR: string;
        NO_CONNECTION_TO_DATABASE: string;
        NO_INTERNET_CONNECTION: string;
        NO_CONNECTION_TO_SERVER: string;
        BAD_REQUEST: string;
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
            REDIRECTS: string[];
        };
        TITLE_SUFFIX: " | zurich-meets-tanzania";
        TITLES: {
            [path: `/${string}`]: PageDescription;
        };
        REDIRECTS: {
            [path: `/${string}`]: string[];
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

export type PageDescription = {
    title: string;
    description: string;
    lastUpdated: string;
};

export type MetaPersonas = {
    name: string;
    email: string;
    website?: string;
    linkedIn?: string;
    github?: string;
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

export type DatabaseResult =
    | {
          data: RowDataPacket[] | RowDataPacket;
          error: null;
      }
    | {
          data: null;
          error: string;
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

export type HTMLInputTypes =
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";

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
        user: PublicUser | null;
    };
}

export interface DatabaseApiEndpointResponse extends ApiEndpointResponse {
    data: DatabaseResult | null;
}

export interface AddToNewsletterListApiEndpointResponse extends ApiEndpointResponse {
    data: {
        alreadyLoggedIn: boolean;
    };
}

export interface ApiEndpointResponseWithRedirect extends ApiEndpointResponse {
    data: {
        redirectUrl: string | null;
        queryParams?: {
            [name: string]: string;
        };
    };
}

export interface GetThemeApiEndpointResponse extends ApiEndpointResponse {
    data: {
        theme: null | "dark" | "light";
    };
}

export interface GetPasswordsApiEndpointResponse extends ApiEndpointResponse {
    data: LoginInformation[];
}

export interface GetStaticSiteApiEndpointResponse extends ApiEndpointResponse {
    data: {
        site: StaticSite;
        date: string;
    } | null;
}

export interface GetAllStaticSitesApiEndpointResponse extends ApiEndpointResponse {
    data: StaticSiteStorage[] | null;
}

export interface GetTeamApiEndpointResponse extends ApiEndpointResponse {
    data: Team | null;
}

export interface GetBlogApiEndpointResponse extends ApiEndpointResponse {
    data: Blog | null;
}

export interface GetAllBlogsApiEndpointResponse extends ApiEndpointResponse {
    data: Blog[] | null;
}

export interface GetBlogMetadataApiEndpointResponse extends ApiEndpointResponse {
    data: BlogMetadata[];
}

export interface GetNewsApiEndpointResponse extends ApiEndpointResponse {
    data: News | null;
}

export interface GetLastXNewsIdsApiEndpointResponse extends ApiEndpointResponse {
    data: number[];
}

export interface GetAllNewsApiEndpointResponse extends ApiEndpointResponse {
    data: News[] | null;
}

export interface GetVisitorCountsApiEndpointResponse extends ApiEndpointResponse {
    data: VisitorCounts[];
}

export interface GetAllUsersApiEndpointResponse extends ApiEndpointResponse {
    data: PrivateUser[];
}

export interface UpdateUserWithIdApiEndpointResponse extends ApiEndpointResponse {
    data: PrivateUser | null;
}

export interface UpdateUserProfilePictureWithIdApiEndpointResponse extends ApiEndpointResponse {
    data: { pictureUrl: string } | null;
}

export interface PublicUser {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    type: "user" | "member" | "admin";
    picture: string;
}

export interface PrivateUser extends PublicUser {
    id: number;
    password: string; // Hashed
}

export type NewsletterUser = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    gender: "Herr" | "Frau" | "Divers";
};

export interface NewUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    picture: Blob | null;
}

export type NewsletterSignUpRequest = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: "Herr" | "Frau" | "Divers";
    timestamp: number;
    used: boolean;
};

export type PasswordRecoveryRequest = {
    code: string;
    user: PrivateUser;
    timestamp: number;
};

export type SignUpConfirmRequest = {
    code: string;
    user: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        hasPicture: boolean;
        pictureFile: Express.Multer.File | undefined;
        phone: string;
        address: string;
    };
    timestamp: number;
};

export type MailjetAttachment = {
    ContentType: string;
    Filename: string;
    Base64Content: string;
};

export type LoginInformation = {
    websiteUrl: string;
    websiteLabel: string;
    username: string;
    password: string;
    twoFactorSecret?: string;
};

export type StaticSite = {
    metadata: {
        title: string;
        subtitle: string;
        author: string;
        imageUrl: string;
        imageAlt: string;
    };
    data: CustomElements;
};

export type StaticSiteStorage = {
    id: number;
    title: StaticSiteNames;
    data: StaticSite;
    date: string;
};

export type StaticSiteNames =
    | "vision"
    | "board"
    | "beginning"
    | "finances"
    | "income-statement"
    | "general-meeting"
    | "statutes"
    | "zurich-meets-tanzania"
    | "tanzania-meets-zurich"
    | "mbuzi"
    | "gynecology"
    | "meducation"
    | "bajaji"
    | "cardiology"
    | "surgery"
    | "history";

export interface CustomElement {
    type: "title" | "subtitle" | "paragraph" | "image" | "multipleImages" | "imageWithText" | "line" | "currentTeam";
}

export interface CustomTitleElement extends CustomElement {
    type: "title";
    content: string;
}

export interface CustomSubtitleElement extends CustomElement {
    type: "subtitle";
    content: string;
}

export interface CustomParagraphElement extends CustomElement {
    type: "paragraph";
    content: string;
}

export interface CustomImageElement extends CustomElement {
    type: "image";
    imageUrl: string;
    imageAlt: string;
}

export interface CustomMultipleImagesElement extends CustomElement {
    type: "multipleImages";
    images: {
        imageUrl: string;
        imageAlt: string;
    }[];
}

export interface CustomImageWithTextElement extends CustomElement {
    type: "imageWithText";
    imageUrl: string;
    imageAlt: string;
    content: string;
    sideOfImage: "left" | "right";
}

export interface CustomLineElement extends CustomElement {
    type: "line";
}

export interface CustomCurrentTeamElement extends CustomElement {
    type: "currentTeam";
    teamId: number;
}

export type CustomElements = Array<CustomTitleElement | CustomSubtitleElement | CustomParagraphElement | CustomImageElement | CustomMultipleImagesElement | CustomImageWithTextElement | CustomLineElement | CustomCurrentTeamElement>;

export type DashboardNavigationOptions = "main" | "edit-sites" | "create-blog" | "edit-blog" | "create-news" | "edit-news";

export type DashboardEditTypes =
    | "addTitle"
    | "addSubtitle"
    | "addParagraph"
    | "addImage"
    | "addMultipleImages"
    | "addImageWithText"
    | "addLine"
    | "addCurrentTeam"
    | "editTitle"
    | "editSubtitle"
    | "editParagraph"
    | "editGeneralTitle"
    | "editGeneralSubtitle"
    | "editAuthor"
    | "editTitleImage"
    | "editImage"
    | "editMultipleImages"
    | "editImageWithText"
    | "addNewsImage"
    | "addNewsPdf"
    | "addNewsMultipleImages"
    | "addNewsTitle"
    | "addNewsSubtitle"
    | "addNewsParagraph"
    | "addNewsLine"
    | "editNewsTitle"
    | "editNewsSubtitle"
    | "editNewsParagraph"
    | "editNewsMultipleImages";

export type Team = {
    id: number;
    motto: string;
    text: string;
    picture: string;
    members: TeamMember[];
    date: string;
};

export type TeamMember = {
    firstName: string;
    lastName: string;
    job: string;
    motivation: string;
    imageUrl: string;
};

export type Blog = {
    id: number;
    title: string;
    author: string;
    date: string;
    data: BlogContent;
};

export type BlogMetadata = {
    title: string;
    subtitle: string;
    author: string;
    imageUrl: string;
    imageAlt: string;
}

export type BlogContent = {
    metadata: BlogMetadata;
    data: CustomElements;
};

export type News = {
    id: number;
    date: string;
    data: NewsContent;
};

export interface NewsContentBase {
    type: "image" | "pdf" | "multipleImages";
    content: CustomElements;
    imageUrl?: string;
    imageAlt?: string;
    imagePosition?: "left" | "center" | "right";
    pdfUrl?: string;
}

export interface NewsContentImage extends NewsContentBase {
    type: "image";
    imageUrl: string;
    imageAlt: string;
    imagePosition: "left" | "center" | "right";
}

export interface NewsContentPdf extends NewsContentBase {
    type: "pdf";
    pdfUrl: string;
}

export interface NewsContentMultipleImages extends NewsContentBase {
    type: "multipleImages";
}

export type NewsContent = NewsContentImage | NewsContentPdf | NewsContentMultipleImages;

export type VisitorCounts = {
    bounces: { value: number; prev: number };
    pageviews: { value: number; prev: number };
    uniques: { value: number; prev: number };
    totaltime: { value: number; prev: number };
};

export type EditUserCommand =
    | {
          executionType: "reset";
          fieldType: "phone" | "type" | "picture";
          userId: number;
      }
    | {
          executionType: "edit";
          fieldType: "firstName" | "lastName" | "phone" | "address" | "type";
          userId: number;
          previousValue: string;
          newValue: string;
      }
    | {
          executionType: "edit";
          fieldType: "picture";
          userId: number;
          previousUrl: string;
          newUrl: string;
          pictureUploaded: false;
          picture: null;
      }
    | {
          executionType: "edit";
          fieldType: "picture";
          userId: number;
          previousUrl: string;
          newUrl: string;
          pictureUploaded: true;
          picture: File;
      };
