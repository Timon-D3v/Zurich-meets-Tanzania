import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth-guard";
import { notAuthGuard } from "./guards/not-auth-guard";
import { adminGuard } from "./guards/admin-guard";

export const routes: Routes = [
    // Home route
    {
        path: "",
        pathMatch: "full",
        loadComponent: async () => {
            const component = await import("./home/home");
            return component.Home;
        },
    },

    // Root routes
    {
        path: "bajaji",
        loadComponent: async () => {
            const component = await import("./bajaji/bajaji");
            return component.Bajaji;
        },
    },
    {
        path: "beginning",
        loadComponent: async () => {
            const component = await import("./beginning/beginning");
            return component.Beginning;
        },
    },
    {
        path: "blog/*",
        loadComponent: async () => {
            const component = await import("./blog/blog");
            return component.Blog;
        },
    },
    {
        path: "cardiology",
        loadComponent: async () => {
            const component = await import("./cardiology/cardiology");
            return component.Cardiology;
        },
    },
    {
        path: "current-team",
        loadComponent: async () => {
            const component = await import("./current-team/current-team");
            return component.CurrentTeam;
        },
    },
    {
        path: "contact",
        loadComponent: async () => {
            const component = await import("./contact/contact");
            return component.Contact;
        },
    },
    {
        path: "donate",
        loadComponent: async () => {
            const component = await import("./donate/donate");
            return component.Donate;
        },
    },
    {
        path: "executives",
        loadComponent: async () => {
            const component = await import("./executives/executives");
            return component.Executives;
        },
    },
    {
        path: "finances",
        loadComponent: async () => {
            const component = await import("./finances/finances");
            return component.Finances;
        },
    },
    {
        path: "gallery/*",
        loadComponent: async () => {
            const component = await import("./gallery/gallery");
            return component.Gallery;
        },
    },
    {
        path: "general-meeting",
        loadComponent: async () => {
            const component = await import("./general-meeting/general-meeting");
            return component.GeneralMeeting;
        },
    },
    {
        path: "gynecology",
        loadComponent: async () => {
            const component = await import("./gynecology/gynecology");
            return component.Gynecology;
        },
    },
    {
        path: "history-tanzania",
        loadComponent: async () => {
            const component = await import("./history-tanzania/history-tanzania");
            return component.HistoryTanzania;
        },
    },
    {
        path: "imprint",
        loadComponent: async () => {
            const component = await import("./imprint/imprint");
            return component.Imprint;
        },
    },
    {
        path: "income-statement",
        loadComponent: async () => {
            const component = await import("./income-statement/income-statement");
            return component.IncomeStatement;
        },
    },
    {
        path: "mbuzi",
        loadComponent: async () => {
            const component = await import("./mbuzi/mbuzi");
            return component.Mbuzi;
        },
    },
    {
        path: "meducation",
        loadComponent: async () => {
            const component = await import("./meducation/meducation");
            return component.Meducation;
        },
    },
    {
        path: "membership",
        loadComponent: async () => {
            const component = await import("./membership/membership");
            return component.Membership;
        },
    },
    {
        path: "newsletter-sign-out",
        loadComponent: async () => {
            const component = await import("./newsletter-sign-out/newsletter-sign-out");
            return component.NewsletterSignOut;
        },
    },
    {
        path: "statutes",
        loadComponent: async () => {
            const component = await import("./statutes/statutes");
            return component.Statutes;
        },
    },
    {
        path: "surgery",
        loadComponent: async () => {
            const component = await import("./surgery/surgery");
            return component.Surgery;
        },
    },
    {
        path: "tanzania-meets-zurich",
        loadComponent: async () => {
            const component = await import("./tanzania-meets-zurich/tanzania-meets-zurich");
            return component.TanzaniaMeetsZurich;
        },
    },
    {
        path: "vision",
        loadComponent: async () => {
            const component = await import("./vision/vision");
            return component.Vision;
        },
    },
    {
        path: "zurich-meets-tanzania",
        loadComponent: async () => {
            const component = await import("./zurich-meets-tanzania/zurich-meets-tanzania");
            return component.ZurichMeetsTanzania;
        },
    },

    // Secured routes
    {
        path: "account",
        loadComponent: async () => {
            const component = await import("./account/account");
            return component.Account;
        },
        canActivate: [authGuard],
    },

    // Only for unauthenticated users
    {
        path: "login",
        loadComponent: async () => {
            const component = await import("./login/login");
            return component.Login;
        },
        canActivate: [notAuthGuard],
    },
    {
        path: "signup",
        loadComponent: async () => {
            const component = await import("./signup/signup");
            return component.Signup;
        },
        canActivate: [notAuthGuard],
    },

    // Admin routes
    {
        path: "admin",
        loadComponent: async () => {
            const component = await import("./secured/dashboard/dashboard");
            return component.Dashboard;
        },
        canActivate: [adminGuard],
    },
];
