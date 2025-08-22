import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { notAuthGuard } from "./guards/not-auth.guard";
import { adminGuard } from "./guards/admin.guard";

export const routes: Routes = [
    // Home route
    {
        path: "",
        pathMatch: "full",
        loadComponent: async () => {
            const component = await import("./home/home.component");
            return component.HomeComponent;
        },
    },

    // Root routes
    {
        path: "archive",
        loadComponent: async () => {
            const component = await import("./news-archive/news-archive.component");
            return component.NewsArchiveComponent;
        },
    },
    {
        path: "bajaji",
        loadComponent: async () => {
            const component = await import("./bajaji/bajaji.component");
            return component.BajajiComponent;
        },
    },
    {
        path: "beginning",
        loadComponent: async () => {
            const component = await import("./beginning/beginning.component");
            return component.BeginningComponent;
        },
    },
    {
        path: "blog/*",
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
    },
    {
        path: "current-team",
        loadComponent: async () => {
            const component = await import("./current-team/current-team.component");
            return component.CurrentTeamComponent;
        },
    },
    {
        path: "contact",
        loadComponent: async () => {
            const component = await import("./contact/contact.component");
            return component.ContactComponent;
        },
    },
    {
        path: "donate",
        loadComponent: async () => {
            const component = await import("./donate/donate.component");
            return component.DonateComponent;
        },
    },
    {
        path: "executives",
        loadComponent: async () => {
            const component = await import("./executives/executives.component");
            return component.ExecutivesComponent;
        },
    },
    {
        path: "finances",
        loadComponent: async () => {
            const component = await import("./finances/finances.component");
            return component.FinancesComponent;
        },
    },
    {
        path: "gallery/*",
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
    },
    {
        path: "gynecology",
        loadComponent: async () => {
            const component = await import("./gynecology/gynecology.component");
            return component.GynecologyComponent;
        },
    },
    {
        path: "history-tanzania",
        loadComponent: async () => {
            const component = await import("./history-tanzania/history-tanzania.component");
            return component.HistoryTanzaniaComponent;
        },
    },
    {
        path: "imprint",
        loadComponent: async () => {
            const component = await import("./imprint/imprint.component");
            return component.ImprintComponent;
        },
    },
    {
        path: "income-statement",
        loadComponent: async () => {
            const component = await import("./income-statement/income-statement.component");
            return component.IncomeStatementComponent;
        },
    },
    {
        path: "mbuzi",
        loadComponent: async () => {
            const component = await import("./mbuzi/mbuzi.component");
            return component.MbuziComponent;
        },
    },
    {
        path: "meducation",
        loadComponent: async () => {
            const component = await import("./meducation/meducation.component");
            return component.MeducationComponent;
        },
    },
    {
        path: "membership",
        loadComponent: async () => {
            const component = await import("./membership/membership.component");
            return component.MembershipComponent;
        },
    },
    {
        path: "newsletter-sign-out",
        loadComponent: async () => {
            const component = await import("./newsletter-sign-out/newsletter-sign-out.component");
            return component.NewsletterSignOutComponent;
        },
    },
    {
        path: "password-recovery",
        loadComponent: async () => {
            const component = await import("./password-recovery/password-recovery.component");
            return component.PasswordRecoveryComponent;
        },
    },
    {
        path: "privacy",
        loadComponent: async () => {
            const component = await import("./privacy/privacy.component");
            return component.PrivacyComponent;
        },
    },
    {
        path: "statutes",
        loadComponent: async () => {
            const component = await import("./statutes/statutes.component");
            return component.StatutesComponent;
        },
    },
    {
        path: "surgery",
        loadComponent: async () => {
            const component = await import("./surgery/surgery.component");
            return component.SurgeryComponent;
        },
    },
    {
        path: "tanzania-meets-zurich",
        loadComponent: async () => {
            const component = await import("./tanzania-meets-zurich/tanzania-meets-zurich.component");
            return component.TanzaniaMeetsZurichComponent;
        },
    },
    {
        path: "vision",
        loadComponent: async () => {
            const component = await import("./vision/vision.component");
            return component.VisionComponent;
        },
    },
    {
        path: "zurich-meets-tanzania",
        loadComponent: async () => {
            const component = await import("./zurich-meets-tanzania/zurich-meets-tanzania.component");
            return component.ZurichMeetsTanzaniaComponent;
        },
    },

    // Secured routes
    {
        path: "account",
        loadComponent: async () => {
            const component = await import("./account/account.component");
            return component.AccountComponent;
        },
        canActivate: [authGuard],
    },

    // Only for unauthenticated users
    {
        path: "login",
        loadComponent: async () => {
            const component = await import("./login/login.component");
            return component.LoginComponent;
        },
        canActivate: [notAuthGuard],
    },
    {
        path: "signup",
        loadComponent: async () => {
            const component = await import("./signup/signup.component");
            return component.SignupComponent;
        },
        canActivate: [notAuthGuard],
    },

    // Admin routes
    {
        path: "admin",
        loadComponent: async () => {
            const component = await import("./secured/dashboard/dashboard.component");
            return component.DashboardComponent;
        },
        canActivate: [adminGuard],
    },
];
