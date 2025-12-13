import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { notAuthGuard } from "./guards/not-auth.guard";
import { adminGuard } from "./guards/admin.guard";
import { PUBLIC_CONFIG } from "../publicConfig";

export const routes: Routes = [
    // Home route
    {
        path: "",
        pathMatch: "full",
        loadComponent: async () => {
            const component = await import("./home/home.component");
            return component.HomeComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },

    // Root routes
    {
        path: "archive",
        loadComponent: async () => {
            const component = await import("./news-archive/news-archive.component");
            return component.NewsArchiveComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/archive"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "bajaji",
        loadComponent: async () => {
            const component = await import("./bajaji/bajaji.component");
            return component.BajajiComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/bajaji"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "beginning",
        loadComponent: async () => {
            const component = await import("./beginning/beginning.component");
            return component.BeginningComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/beginning"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "blog/:name",
        loadComponent: async () => {
            const component = await import("./blog/blog.component");
            return component.BlogComponent;
        },
    },
    {
        path: "cardiology",
        loadComponent: async () => {
            const component = await import("./cardiology/cardiology.component");
            return component.CardiologyComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/cardiology"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "current-team",
        loadComponent: async () => {
            const component = await import("./current-team/current-team.component");
            return component.CurrentTeamComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/current-team"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "contact",
        loadComponent: async () => {
            const component = await import("./contact/contact.component");
            return component.ContactComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/contact"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "donate",
        loadComponent: async () => {
            const component = await import("./donate/donate.component");
            return component.DonateComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/donate"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "executives",
        loadComponent: async () => {
            const component = await import("./executives/executives.component");
            return component.ExecutivesComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/executives"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "finances",
        loadComponent: async () => {
            const component = await import("./finances/finances.component");
            return component.FinancesComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/finances"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "gallery/:name",
        loadComponent: async () => {
            const component = await import("./gallery/gallery.component");
            return component.GalleryComponent;
        },
    },
    {
        path: "general-meeting",
        loadComponent: async () => {
            const component = await import("./general-meeting/general-meeting.component");
            return component.GeneralMeetingComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/general-meeting"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "gynecology",
        loadComponent: async () => {
            const component = await import("./gynecology/gynecology.component");
            return component.GynecologyComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/gynecology"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "history-tanzania",
        loadComponent: async () => {
            const component = await import("./history-tanzania/history-tanzania.component");
            return component.HistoryTanzaniaComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/history-tanzania"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "imprint",
        loadComponent: async () => {
            const component = await import("./imprint/imprint.component");
            return component.ImprintComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/imprint"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "income-statement",
        loadComponent: async () => {
            const component = await import("./income-statement/income-statement.component");
            return component.IncomeStatementComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/income-statement"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "mbuzi",
        loadComponent: async () => {
            const component = await import("./mbuzi/mbuzi.component");
            return component.MbuziComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/mbuzi"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "meducation",
        loadComponent: async () => {
            const component = await import("./meducation/meducation.component");
            return component.MeducationComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/meducation"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "membership",
        loadComponent: async () => {
            const component = await import("./membership/membership.component");
            return component.MembershipComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/membership"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "newsletter/cancel",
        loadComponent: async () => {
            const component = await import("./newsletter-sign-out/newsletter-sign-out.component");
            return component.NewsletterSignOutComponent;
        },
        // TODO: Change either the url newsletter/cancel or the route /newsletter-sign-out
        title: PUBLIC_CONFIG.ROUTES.TITLES["/newsletter-sign-out"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "newsletter/confirm",
        loadComponent: async () => {
            const component = await import("./newsletter-sign-up-confirm/newsletter-sign-up-confirm.component");
            return component.NewsletterSignUpConfirmComponent;
        },
        // TODO: Add an entry to the route titles
        title: PUBLIC_CONFIG.ROUTES.TITLES["/newsletter-sign-out"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "privacy",
        loadComponent: async () => {
            const component = await import("./privacy/privacy.component");
            return component.PrivacyComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/privacy"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "statutes",
        loadComponent: async () => {
            const component = await import("./statutes/statutes.component");
            return component.StatutesComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/statutes"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "surgery",
        loadComponent: async () => {
            const component = await import("./surgery/surgery.component");
            return component.SurgeryComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/surgery"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "tanzania-meets-zurich",
        loadComponent: async () => {
            const component = await import("./tanzania-meets-zurich/tanzania-meets-zurich.component");
            return component.TanzaniaMeetsZurichComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/tanzania-meets-zurich"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "vision",
        loadComponent: async () => {
            const component = await import("./vision/vision.component");
            return component.VisionComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/vision"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "zurich-meets-tanzania",
        loadComponent: async () => {
            const component = await import("./zurich-meets-tanzania/zurich-meets-tanzania.component");
            return component.ZurichMeetsTanzaniaComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/zurich-meets-tanzania"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },

    // Secured routes
    {
        path: "account",
        loadComponent: async () => {
            const component = await import("./account/account.component");
            return component.AccountComponent;
        },
        canActivate: [authGuard],
        title: PUBLIC_CONFIG.ROUTES.TITLES["/account"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },

    // Only for unauthenticated users
    {
        path: "login",
        loadComponent: async () => {
            const component = await import("./login/login.component");
            return component.LoginComponent;
        },
        canActivate: [notAuthGuard],
        title: PUBLIC_CONFIG.ROUTES.TITLES["/login"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "signup",
        loadComponent: async () => {
            const component = await import("./signup/signup.component");
            return component.SignupComponent;
        },
        canActivate: [notAuthGuard],
        title: PUBLIC_CONFIG.ROUTES.TITLES["/signup"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "signup-confirm",
        loadComponent: async () => {
            const component = await import("./signup-confirm/signup-confirm.component");
            return component.SignupConfirmComponent;
        },
        canActivate: [notAuthGuard],
        title: PUBLIC_CONFIG.ROUTES.TITLES["/signup-confirm"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "password-recovery",
        loadComponent: async () => {
            const component = await import("./password-recovery/password-recovery.component");
            return component.PasswordRecoveryComponent;
        },
        canActivate: [notAuthGuard],
        title: PUBLIC_CONFIG.ROUTES.TITLES["/password-recovery"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
    {
        path: "password-recovery-confirm",
        loadComponent: async () => {
            const component = await import("./password-recovery-confirm/password-recovery-confirm.component");
            return component.PasswordRecoveryConfirmComponent;
        },
        canActivate: [notAuthGuard],
        title: PUBLIC_CONFIG.ROUTES.TITLES["/password-recovery-confirm"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },

    // Admin routes
    {
        path: "admin",
        loadComponent: async () => {
            const component = await import("./secured/dashboard/dashboard.component");
            return component.DashboardComponent;
        },
        canActivate: [adminGuard],
        title: PUBLIC_CONFIG.ROUTES.TITLES["/admin"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },

    // 404 Page
    {
        path: "**",
        loadComponent: async () => {
            const component = await import("./page-not-found/page-not-found.component");
            return component.PageNotFoundComponent;
        },
        title: PUBLIC_CONFIG.ROUTES.TITLES["/error404"].title + PUBLIC_CONFIG.ROUTES.TITLE_SUFFIX,
    },
];
