import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Subject, take } from "rxjs";
import {
    ApiEndpointResponse,
    BlogContent,
    CalendarEvent,
    CustomImageWithTextElement,
    DashboardEditTypes,
    DashboardNavigationOptions,
    DatabaseApiEndpointResponse,
    GetAllBlogsApiEndpointResponse,
    GetAllNewsApiEndpointResponse,
    GetAllStaticSitesApiEndpointResponse,
    GetBlogApiEndpointResponse,
    GetCalendarEventsApiEndpointResponse,
    GetStaticSiteApiEndpointResponse,
    GetTeamApiEndpointResponse,
    News,
    StaticSite,
    StaticSiteNames,
} from "../../..";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { TeamService } from "../../services/team.service";
import { BlogService } from "../../services/blog.service";
import { EditService } from "../../services/edit.service";
import { SubpagesService } from "../../services/subpages.service";
import { NotificationService } from "../../services/notification.service";
import { AdminNavElementComponent } from "../components/admin-nav-element/admin-nav-element.component";
import { AdminPasswordsPageComponent } from "../components/admin-passwords-page/admin-passwords-page.component";
import { AdminHomepagePicturePageComponent } from "../components/admin-homepage-picture-page/admin-homepage-picture-page.component";
import { EditStaticSiteComponent } from "../components/edit-static-site/edit-static-site.component";
import { AdminAddAdminComponent } from "../components/admin-add-admin/admin-add-admin.component";
import { AdminRemoveAdminComponent } from "../components/admin-remove-admin/admin-remove-admin.component";
import { MembersRemoveManualMemberComponent } from "../components/members-remove-manual-member/members-remove-manual-member.component";
import { AdminCreateAccountComponent } from "../components/admin-create-account/admin-create-account.component";
import { StatsWebsiteAnalyticsComponent } from "../components/stats-website-analytics/stats-website-analytics.component";
import { StatsUserListComponent } from "../components/stats-user-list/stats-user-list.component";
import { DonationsAllTimeDonationsListComponent } from "../components/donations-all-time-donations-list/donations-all-time-donations-list.component";
import { DonationsDeleteShopItemComponent } from "../components/donations-delete-shop-item/donations-delete-shop-item.component";
import { DonationsCreateShopItemComponent } from "../components/donations-create-shop-item/donations-create-shop-item.component";
import { DonationsPushDonationMeterComponent } from "../components/donations-push-donation-meter/donations-push-donation-meter.component";
import { DonationsRemoveDonationMeterComponent } from "../components/donations-remove-donation-meter/donations-remove-donation-meter.component";
import { DonationsCreateDonationMeterComponent } from "../components/donations-create-donation-meter/donations-create-donation-meter.component";
import { DonationsFormEntriesComponent } from "../components/donations-form-entries/donations-form-entries.component";
import { MembersAddManualMemberComponent } from "../components/members-add-manual-member/members-add-manual-member.component";
import { GalleryRemoveImagesComponent } from "../components/gallery-remove-images/gallery-remove-images.component";
import { GalleryAddImagesComponent } from "../components/gallery-add-images/gallery-add-images.component";
import { GalleryDeleteGalleryComponent } from "../components/gallery-delete-gallery/gallery-delete-gallery.component";
import { GalleryCreateGalleryComponent } from "../components/gallery-create-gallery/gallery-create-gallery.component";
import { TeamRemoveMemberComponent } from "../components/team-remove-member/team-remove-member.component";
import { TeamAddMemberComponent } from "../components/team-add-member/team-add-member.component";
import { TeamCreateTeamComponent } from "../components/team-create-team/team-create-team.component";
import { CalendarCreateEventComponent } from "../components/calendar-create-event/calendar-create-event.component";
import { NewsEditNewsComponent } from "../components/news-edit-news/news-edit-news.component";
import { PopupTitleInputComponent } from "../../components/popup-title-input/popup-title-input.component";
import { PopupTextInputComponent } from "../../components/popup-text-input/popup-text-input.component";
import { PopupImageInputComponent } from "../../components/popup-image-input/popup-image-input.component";
import { PopupMultipleImagesInputComponent } from "../../components/popup-multiple-images-input/popup-multiple-images-input.component";
import { PopupSelectionInputComponent } from "../../components/popup-selection-input/popup-selection-input.component";
import { PopupConfirmComponent } from "../../components/popup-confirm/popup-confirm.component";
import { PopupAlertComponent } from "../../components/popup-alert/popup-alert.component";
import { LoadingComponent } from "../../components/loading/loading.component";
import { NewsService } from "../../services/news.service";
import { PopupFileInputComponent } from "../../components/popup-file-input/popup-file-input.component";
import { CalendarService } from "../../services/calendar.service";
import { formatDateRangeString } from "../../../shared/utils";

@Component({
    selector: "app-dashboard",
    imports: [
        AdminNavElementComponent,
        AdminPasswordsPageComponent,
        AdminHomepagePicturePageComponent,
        EditStaticSiteComponent,
        AdminAddAdminComponent,
        AdminRemoveAdminComponent,
        MembersRemoveManualMemberComponent,
        AdminCreateAccountComponent,
        StatsWebsiteAnalyticsComponent,
        StatsUserListComponent,
        DonationsAllTimeDonationsListComponent,
        DonationsDeleteShopItemComponent,
        DonationsCreateShopItemComponent,
        DonationsPushDonationMeterComponent,
        DonationsRemoveDonationMeterComponent,
        DonationsCreateDonationMeterComponent,
        DonationsFormEntriesComponent,
        MembersAddManualMemberComponent,
        GalleryRemoveImagesComponent,
        GalleryAddImagesComponent,
        GalleryDeleteGalleryComponent,
        GalleryCreateGalleryComponent,
        TeamRemoveMemberComponent,
        TeamAddMemberComponent,
        TeamCreateTeamComponent,
        CalendarCreateEventComponent,
        NewsEditNewsComponent,
        PopupTitleInputComponent,
        PopupTextInputComponent,
        PopupImageInputComponent,
        PopupMultipleImagesInputComponent,
        PopupSelectionInputComponent,
        PopupConfirmComponent,
        PopupAlertComponent,
        LoadingComponent,
        PopupFileInputComponent,
    ],
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
    /*
     * ===============================================================
     *                           GLOBAL
     * ===============================================================
     */

    mobileNavOpen = signal<boolean>(false);

    /*
     * ===============================================================
     *                      BLOG TITLE LIST
     * ===============================================================
     */

    allEditableBlogs: string[] = [];
    allEditableNews: string[] = [];
    allEditableEvents: string[] = [];

    /*
     * ===============================================================
     *                        ACTIVE SIGNALS
     * ===============================================================
     */

    currentActiveSection = signal<string>("stats-website-analytics");
    currentActiveNavigation = signal<DashboardNavigationOptions>("main");
    currentActiveSiteEdit = signal<StaticSiteNames>("vision");
    currentActiveBlogEdit = signal<string>("awaitSelection");
    currentActiveNewsEdit = signal<string>("awaitSelection");
    currentActionToPerform = signal<DashboardEditTypes>("addTitle");
    currentIndexToEdit = signal<number>(-1);

    /*
     * ===============================================================
     *                     SUBMISSION BUTTON
     * ===============================================================
     */

    submitEditsButton = signal<string>("Abschliessen");

    /*
     * ===============================================================
     *                       OPEN SIGNALS
     * ===============================================================
     */

    titleInputOpen = signal(false);
    textInputOpen = signal(false);
    imageInputOpen = signal(false);
    fileInputOpen = signal(false);
    multipleImagesInputOpen = signal(false);
    selectionInputOpen = signal(false);
    confirmInputOpen = signal(false);
    alertOpen = signal(false);

    /*
     * ===============================================================
     *                         OBSERVABLES
     * ===============================================================
     */

    confirmInputObservable = new Subject<boolean>();
    selectionInputObservable = new Subject<string>();

    /*
     * ===============================================================
     *                       ALERT INPUTS
     * ===============================================================
     */

    alertTitle = signal<string>("");
    alertMessage = signal<string>("");
    alertButtonText = signal<string>("");

    titleInputTitle = signal<string>("");
    titleInputDescription = signal<string>("");
    titleInputLabel = signal<string>("");
    titleInputPlaceholder = signal<string>("");

    confirmInputTitle = signal<string>("");
    confirmInputDescription = signal<string>("");
    confirmInputAcceptButtonText = signal<string>("");
    confirmInputCancelButtonText = signal<string>("");
    confirmInputEqualOptions = signal<boolean>(false);

    titleEditInputOpen = signal(false);
    textEditInputOpen = signal(false);
    imageEditInputOpen = signal(false);
    multipleImagesEditInputOpen = signal(false);

    titleEditInputTitle = signal<string>("");
    titleEditInputDescription = signal<string>("");
    titleEditInputLabel = signal<string>("");
    titleEditInputPlaceholder = signal<string>("");
    titleEditInputValue = signal<string>("");

    textEditInputTitle = signal<string>("");
    textEditInputDescription = signal<string>("");
    textEditInputLabel = signal<string>("");
    textEditInputPlaceholder = signal<string>("");
    textEditInputValue = signal<string>("");

    imageEditInputTitle = signal<string>("");
    imageEditInputDescription = signal<string>("");
    imageEditInputLabel = signal<string>("");
    imageEditInputPlaceholderUrl = signal<string>("");

    multipleImagesEditInputTitle = signal<string>("");
    multipleImagesEditInputDescription = signal<string>("");
    multipleImagesEditInputLabel = signal<string>("");
    multipleImagesEditInputValue = signal<{ imageUrl: string; imageAlt: string }[]>([]);

    selectionInputTitle = signal<string>("");
    selectionInputDescription = signal<string>("");
    selectionInputLabel = signal<string>("");
    selectionInputPlaceholder = signal<string>("");
    selectionInputOptions = signal<string[]>([]);

    fileInputAccept = signal<string>("*");

    /*
     * ===============================================================
     *                     SHORT TERM CACHE
     * ===============================================================
     */

    textWithImageTextCache = signal<string>("");

    /*
     * ===============================================================
     *                    STATIC SITES EDIT CACHE
     * ===============================================================
     */

    siteEdits = {
        "vision": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "board": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "beginning": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "finances": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "income-statement": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "general-meeting": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "statutes": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "zurich-meets-tanzania": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "tanzania-meets-zurich": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "mbuzi": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "gynecology": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "meducation": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "bajaji": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "cardiology": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "surgery": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        "history": signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
    };

    siteEditImages: { [key: string]: { url: string; file: File }[] } = {
        "vision": [],
        "board": [],
        "beginning": [],
        "finances": [],
        "income-statement": [],
        "general-meeting": [],
        "statutes": [],
        "zurich-meets-tanzania": [],
        "tanzania-meets-zurich": [],
        "mbuzi": [],
        "gynecology": [],
        "meducation": [],
        "bajaji": [],
        "cardiology": [],
        "surgery": [],
        "history": [],
    };

    /*
     * ===============================================================
     *                       BLOG EDIT CACHE
     * ===============================================================
     */

    blogs: { newBlog: WritableSignal<BlogContent>; existingBlogs: { [key: string]: WritableSignal<BlogContent> } } = {
        newBlog: signal<BlogContent>({ metadata: { title: "Bearbeite mich :)", subtitle: "", author: "", imageUrl: PUBLIC_CONFIG.FALLBACK_IMAGE_URL, imageAlt: "" }, data: [] }),
        existingBlogs: {
            awaitSelection: signal<StaticSite>({ metadata: { title: "", subtitle: "", author: "", imageUrl: "", imageAlt: "" }, data: [] }),
        },
    };

    blogImages: { newBlog: { url: string; file: File }[]; existingBlogs: { [key: string]: { url: string; file: File }[] } } = {
        newBlog: [],
        existingBlogs: {},
    };

    /*
     * ===============================================================
     *                       NEWS EDIT CACHE
     * ===============================================================
     */

    news: { newNews: WritableSignal<News>; existingNews: { [key: string]: WritableSignal<News> } } = {
        newNews: signal<News>({ id: -1, date: "1900/12/22", data: { type: "image", imageUrl: PUBLIC_CONFIG.FALLBACK_IMAGE_URL, imageAlt: "", imagePosition: "center", content: [] } }),
        existingNews: {
            awaitSelection: signal<News>({ id: -2, date: "1900/12/22", data: { type: "image", imageUrl: PUBLIC_CONFIG.FALLBACK_IMAGE_URL, imageAlt: "", imagePosition: "center", content: [] } }),
        },
    };

    newsImages: { newNews: { url: string; file: File }[]; existingNews: { [key: string]: { url: string; file: File }[] } } = {
        newNews: [],
        existingNews: {},
    };

    /*
     * ===============================================================
     *                       CALENDAR CACHE
     * ===============================================================
     */

    calendarEvents: CalendarEvent[] = [];

    /*
     * ===============================================================
     *                          SERVICES
     * ===============================================================
     */

    private teamService = inject(TeamService);
    private blogService = inject(BlogService);
    private newsService = inject(NewsService);
    private editService = inject(EditService);
    private calendarService = inject(CalendarService);
    private subpagesService = inject(SubpagesService);
    private notificationService = inject(NotificationService);

    /*
     * ===============================================================
     *                         PLATFORM ID
     * ===============================================================
     */

    private platformId = inject(PLATFORM_ID);

    /*
     * ===============================================================
     *                       GLOBAL FUNCTIONS
     * ===============================================================
     */

    ngOnInit(): void {
        // Get all static sites for editing
        const staticSitesRequest = this.subpagesService.getAllStaticSites();

        staticSitesRequest.subscribe((response: GetAllStaticSitesApiEndpointResponse) => {
            if (response.error || response.data === null || !Array.isArray(response.data)) {
                this.notificationService.error("Fehler beim Laden der Seiten", "Die statischen Seiten konnten nicht geladen werden: " + response.message);

                return;
            }

            for (const site of response.data) {
                this.siteEdits[site.title].set(site.data);
                this.siteEditImages[site.title] = [];
            }
        });

        // Get all existing blog titles for editing
        this.getAllBlogTitles();

        // Get all blogs for editing
        const getAllBlogsRequest = this.blogService.getAllBlogs();

        getAllBlogsRequest.subscribe((response: GetAllBlogsApiEndpointResponse) => {
            if (response.error || response.data === null) {
                this.notificationService.error("Fehler beim Laden der Blogs", "Die Blogs konnten nicht geladen werden: " + response.message);

                return;
            }

            for (const blog of response.data) {
                this.blogs.existingBlogs[blog.title] = signal<BlogContent>(blog.data);
                this.blogImages.existingBlogs[blog.title] = [];
            }
        });

        // Get all news for editing
        this.getAllNews();

        // Get all events for deleting
        this.getAllEvents();
    }

    getAllBlogTitles(): void {
        this.allEditableBlogs = [];

        const blogTitlesRequest = this.blogService.getAllBlogLinks();

        blogTitlesRequest.subscribe((response: DatabaseApiEndpointResponse) => {
            if (response.error || response.data?.data === null || !Array.isArray(response.data?.data)) {
                this.notificationService.error("Fehler beim Laden der Blogs", "Die Blogs konnten nicht geladen werden: " + response.message);

                return;
            }

            for (const blog of response.data.data) {
                this.allEditableBlogs.push(blog["title"]);
            }
        });
    }

    getAllNews(): void {
        this.allEditableNews = [];

        const newsRequest = this.newsService.getAllNews();

        newsRequest.subscribe((response: GetAllNewsApiEndpointResponse) => {
            if (response.error || response.data === null || !Array.isArray(response.data)) {
                this.notificationService.error("Fehler beim Laden der News", "Die News konnten nicht geladen werden: " + response.message);

                return;
            }

            const getNewsName = (news: News, round = 0): string => {
                const date = new Date(news["date"]).toLocaleDateString();

                const newsName = round === 0 ? date : `${date} (${round})`;

                if (this.allEditableNews.includes(newsName)) {
                    return getNewsName(news, round + 1);
                }

                return newsName;
            };

            for (const news of response.data) {
                const newsName = getNewsName(news);

                this.allEditableNews.push(newsName);

                this.news.existingNews[newsName] = signal<News>(news);
                this.newsImages.existingNews[newsName] = [];
            }
        });
    }

    getAllEvents(): void {
        this.allEditableEvents = [];

        const calendarRequest = this.calendarService.getAllEvents();

        calendarRequest.subscribe((response: GetCalendarEventsApiEndpointResponse) => {
            if (response.error || response.data === null || !Array.isArray(response.data)) {
                this.notificationService.error("Fehler beim Laden der Events", "Die Events konnten nicht geladen werden: " + response.message);

                return;
            }

            for (const event of response.data) {
                this.calendarEvents.push(event);
                this.allEditableEvents.push(`${formatDateRangeString(new Date(event.startDate), new Date(event.endDate))} - ${event.title}`);
            }
        });
    }

    toggleMobileNav(): void {
        this.mobileNavOpen.update((value) => !value);
    }

    /*
     * ===============================================================
     *                      HELPER FUNCTIONS
     * ===============================================================
     */

    async awaitConfirmation(title: string, message: string, accept: string = "Ok", reject: string = "Abbrechen", equalOptions: boolean = false): Promise<boolean> {
        this.confirmInputOpen.set(true);

        this.confirmInputTitle.set(title);
        this.confirmInputDescription.set(message);
        this.confirmInputAcceptButtonText.set(accept);
        this.confirmInputCancelButtonText.set(reject);
        this.confirmInputEqualOptions.set(equalOptions);

        return new Promise<boolean>((resolve) => {
            this.confirmInputObservable.pipe(take(1)).subscribe((result) => {
                resolve(result || false);
            });
        });
    }

    async awaitSelection(options: string[], title: string, message: string, label: string, placeholder: string): Promise<string> {
        this.selectionInputOpen.set(true);

        this.selectionInputTitle.set(title);
        this.selectionInputDescription.set(message);
        this.selectionInputLabel.set(label);
        this.selectionInputPlaceholder.set(placeholder);
        this.selectionInputOptions.set(options);

        return new Promise<string>((resolve) => {
            this.selectionInputObservable.pipe(take(1)).subscribe((result) => {
                resolve(result);
            });
        });
    }

    showAlert(title: string, message: string, buttonText: string = "Schliessen"): void {
        this.alertOpen.set(true);

        this.alertTitle.set(title);
        this.alertMessage.set(message);
        this.alertButtonText.set(buttonText);
    }

    handleAlertClose(): void {
        this.alertOpen.set(false);
    }

    /*
     * ===============================================================
     *                     NAVIGATION FUNCTIONS
     * ===============================================================
     */

    setCurrentActiveNavigation(navigation: DashboardNavigationOptions): void {
        this.currentActiveNavigation.set(navigation);
    }

    activate(section: string): void {
        this.currentActiveSection.set(section);

        // Close the mobile nav after selecting an item
        this.mobileNavOpen.set(false);

        // Scroll to the top of the page
        if (isPlatformBrowser(this.platformId)) {
            window.scroll({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
    }

    generateActivateFunction(section: string, navigation: DashboardNavigationOptions = "main"): Function {
        const _this = this;

        const activationFunction = () => {
            _this.activate(section);
            _this.setCurrentActiveNavigation(navigation);

            if (_this.currentActiveSection().startsWith("edit-static-")) {
                _this.currentActiveSiteEdit.set(section.replace("edit-static-", "") as StaticSiteNames);
            }
        };

        return activationFunction;
    }

    generateSelectBlogToEditFunction(): Function {
        const _this = this;

        const activationFunction = () => {
            _this.selectBlogToEdit();
            _this.generateActivateFunction("blog-edit-blog", "edit-blog")();
        };

        return activationFunction;
    }

    selectBlogToEdit(): void {
        this.selectionInputOpen.set(true);

        this.selectionInputTitle.set("Blog bearbeiten");
        this.selectionInputDescription.set("Bitte gib den Titel des Blogs ein, den du bearbeiten möchtest.");
        this.selectionInputLabel.set("Titel:");
        this.selectionInputPlaceholder.set("Titel suchen");
        this.selectionInputOptions.set(this.allEditableBlogs);
    }

    generateSelectBlogToDeleteFunction(): Function {
        const _this = this;

        const activationFunction = () => {
            _this.selectBlogToDelete();
            _this.generateActivateFunction("blog-delete-blog")();
        };

        return activationFunction;
    }

    selectBlogToDelete(): void {
        this.selectionInputOpen.set(true);

        this.selectionInputTitle.set("Blog löschen");
        this.selectionInputDescription.set("Bitte gib den Titel des Blogs ein, den du löschen möchtest.");
        this.selectionInputLabel.set("Titel:");
        this.selectionInputPlaceholder.set("Titel suchen");
        this.selectionInputOptions.set(this.allEditableBlogs);
    }

    generateSelectNewsToEditFunction(): Function {
        const _this = this;

        const activationFunction = () => {
            _this.selectNewsToEdit();
            _this.generateActivateFunction("news-edit-news", "edit-news")();
        };

        return activationFunction;
    }

    selectNewsToEdit(): void {
        this.selectionInputOpen.set(true);

        this.selectionInputTitle.set("News bearbeiten");
        this.selectionInputDescription.set("Bitte gib das Datum der News ein, die du bearbeiten möchtest.");
        this.selectionInputLabel.set("Datum:");
        this.selectionInputPlaceholder.set("Datum suchen");
        this.selectionInputOptions.set(this.allEditableNews);
    }

    generateSelectEventToDeleteFunction(): Function {
        const _this = this;

        const activationFunction = () => {
            _this.selectEventToDelete();
            _this.generateActivateFunction("calendar-delete-event")();
        };

        return activationFunction;
    }

    selectEventToDelete(): void {
        this.selectionInputOpen.set(true);

        this.selectionInputTitle.set("Event löschen");
        this.selectionInputDescription.set("Bitte gib den Titel des Events ein, das du löschen möchtest.");
        this.selectionInputLabel.set("Titel:");
        this.selectionInputPlaceholder.set("Titel suchen");
        this.selectionInputOptions.set(this.allEditableEvents);
    }

    /*
     * ===============================================================
     *                       CLOSE FUNCTIONS
     * ===============================================================
     */

    async closeEditNavigation(): Promise<void> {
        const confirmClose = await this.awaitConfirmation(
            "Verlassen bestätigen",
            "Vergiss nicht deine Arbeit zu speichern.\nMöchtest du die aktuelle Seite wirklich verlassen? (Dein Fortschritt wird gespeichert, solange du das Dashboard nicht verlässt oder neu lädst)",
            "Verlassen",
            "Abbrechen",
        );

        if (!confirmClose) {
            return;
        }

        this.setCurrentActiveNavigation("main");
    }

    closeNewsEditNavigation(): void {
        this.closeEditNavigation();
    }

    async closePopup(): Promise<void> {
        const yes = await this.awaitConfirmation("Popup schliessen", "Möchtest du das Popup wirklich schliessen? Alle ungespeicherten Änderungen gehen verloren.", "Schliessen", "Abbrechen");

        if (!yes) {
            return;
        }

        this.closePopupWithoutConfirmation();
    }

    closePopupWithoutConfirmation(): void {
        this.titleInputOpen.set(false);
        this.textInputOpen.set(false);
        this.imageInputOpen.set(false);
        this.fileInputOpen.set(false);
        this.multipleImagesInputOpen.set(false);

        this.titleEditInputOpen.set(false);
        this.textEditInputOpen.set(false);
        this.imageEditInputOpen.set(false);
        this.multipleImagesEditInputOpen.set(false);

        this.selectionInputOpen.set(false);
    }

    /*
     * ===============================================================
     *                    EDIT HELPER FUNCTION
     * ===============================================================
     */

    getCurrentEditSignal(): WritableSignal<StaticSite | BlogContent> {
        switch (this.currentActiveNavigation()) {
            case "edit-sites":
                return this.siteEdits[this.currentActiveSiteEdit()];
            case "edit-blog":
                return this.blogs.existingBlogs[this.currentActiveBlogEdit()];
            case "create-blog":
                return this.blogs.newBlog;
            default:
                throw new Error("Unbekannte Navigation: " + this.currentActiveNavigation());
        }
    }

    getCurrentNewsEditSignal(): WritableSignal<News> {
        switch (this.currentActiveNavigation()) {
            case "create-news":
                return this.news.newNews;
            case "edit-news":
                return this.news.existingNews[this.currentActiveNewsEdit()];
            default:
                throw new Error("Unbekannte Navigation: " + this.currentActiveNavigation());
        }
    }

    getCurrentImageStorage(): { url: string; file: File }[] {
        switch (this.currentActiveNavigation()) {
            case "edit-sites":
                return this.siteEditImages[this.currentActiveSiteEdit()];
            case "create-blog":
                return this.blogImages.newBlog;
            case "edit-blog":
                return this.blogImages.existingBlogs[this.currentActiveBlogEdit()];
            case "create-news":
                return this.newsImages.newNews;
            case "edit-news":
                return this.newsImages.existingNews[this.currentActiveNewsEdit()];
            default:
                throw new Error("Unbekannte Navigation: " + this.currentActiveNavigation());
        }
    }

    /*
     * ===============================================================
     *                   SUBMIT EDITS FUNCTIONS
     * ===============================================================
     */

    submitEdits(): void {
        if (this.currentActiveNavigation() === "edit-sites") {
            this.submitSiteEdits();
        } else if (this.currentActiveNavigation() === "edit-blog") {
            this.submitBlogEdits();
        } else if (this.currentActiveNavigation() === "create-blog") {
            this.submitNewBlog();
        } else if (this.currentActiveNavigation() === "create-news") {
            this.submitNewNews();
        } else if (this.currentActiveNavigation() === "edit-news") {
            this.submitNewsEdits();
        } else {
            this.notificationService.error("Fehler beim Speichern", "Unbekannte Navigation: " + this.currentActiveNavigation());
        }
    }

    submitSiteEdits(): void {
        this.submitEditsButton.set("Speichern...");

        const request = this.subpagesService.updateStaticSite(this.currentActiveSiteEdit(), this.siteEdits[this.currentActiveSiteEdit()](), this.siteEditImages[this.currentActiveSiteEdit()]);

        request.subscribe((response: ApiEndpointResponse) => {
            this.submitEditsButton.set("Abschliessen");

            if (response.error) {
                this.notificationService.error("Fehler beim Speichern", "Die Änderungen konnten nicht gespeichert werden: " + response.message);

                return;
            }

            this.notificationService.success("Änderungen gespeichert", response.message);

            // Reset the siteEdits
            this.siteEditImages[this.currentActiveSiteEdit()] = [];

            const request = this.subpagesService.getStaticSite(this.currentActiveSiteEdit());

            request.subscribe((response: GetStaticSiteApiEndpointResponse) => {
                if (response.error || response.data === null) {
                    this.notificationService.error("Fehler beim Laden der Seite", `Die Seite '${this.currentActiveSiteEdit()}' konnte nicht geladen werden: ` + response.message);

                    // Set a Warning as the sites content
                    this.siteEdits[this.currentActiveSiteEdit()].set({
                        data: [],
                        metadata: {
                            title: "Fehler beim Laden der Seite",
                            subtitle: "",
                            author: "",
                            imageUrl: PUBLIC_CONFIG.FALLBACK_IMAGE_URL,
                            imageAlt: "",
                        },
                    });

                    return;
                }

                this.siteEdits[this.currentActiveSiteEdit()].set(response.data.site);
            });
        });
    }

    submitNewBlog(): void {
        this.submitEditsButton.set("Speichern...");

        const request = this.blogService.createBlog(this.blogs.newBlog().metadata.title, this.blogs.newBlog(), this.blogImages.newBlog);

        request.subscribe((response: ApiEndpointResponse) => {
            this.submitEditsButton.set("Abschliessen");

            this.getAllBlogTitles();

            if (response.error) {
                this.notificationService.error("Fehler beim Erstellen", "Der Blog konnte nicht erstellt werden: " + response.message);

                return;
            }

            this.notificationService.success("Blog erstellt", response.message);

            const blogName = this.blogs.newBlog().metadata.title;

            // Reset the blogEdits
            this.currentActiveBlogEdit.set("awaitSelection");

            this.blogImages.newBlog = [];
            this.blogs.newBlog = signal<BlogContent>({ metadata: { title: "Bearbeite mich :)", subtitle: "", author: "", imageUrl: PUBLIC_CONFIG.FALLBACK_IMAGE_URL, imageAlt: "" }, data: [] });

            this.blogImages.existingBlogs[blogName] = [];

            const request = this.blogService.getBlog(blogName);

            request.subscribe((response: GetBlogApiEndpointResponse) => {
                if (response.error || response.data === null) {
                    this.notificationService.error("Fehler beim Laden des Blogs", `Der Blog '${blogName}' konnte nicht geladen werden: ` + response.message);

                    // Set a Warning as the sites content
                    this.blogs.existingBlogs[blogName].set({
                        data: [],
                        metadata: {
                            title: "Fehler beim Laden der Seite",
                            subtitle: "",
                            author: "",
                            imageUrl: PUBLIC_CONFIG.FALLBACK_IMAGE_URL,
                            imageAlt: "",
                        },
                    });

                    this.currentActiveBlogEdit.set(blogName);

                    return;
                }

                this.blogs.existingBlogs[blogName] = signal<BlogContent>(response.data.data);

                this.currentActiveBlogEdit.set(blogName);
            });
        });
    }

    submitBlogEdits(): void {
        this.submitEditsButton.set("Speichern...");

        const request = this.blogService.updateBlog(this.currentActiveBlogEdit(), this.blogs.existingBlogs[this.currentActiveBlogEdit()](), this.blogImages.existingBlogs[this.currentActiveBlogEdit()]);

        request.subscribe((response: ApiEndpointResponse) => {
            this.submitEditsButton.set("Abschliessen");

            this.getAllBlogTitles();

            if (response.error) {
                this.notificationService.error("Fehler beim Speichern", "Die Änderungen konnten nicht gespeichert werden: " + response.message);

                return;
            }

            this.notificationService.success("Änderungen gespeichert", response.message);

            // Reset the blogEdits
            const oldBlogTitle = this.currentActiveBlogEdit();
            const newBlogTitle = this.blogs.existingBlogs[this.currentActiveBlogEdit()]().metadata.title;

            this.currentActiveBlogEdit.set("awaitSelection");

            // Delete the existing images array since the blog name might have changed
            delete this.blogImages.existingBlogs[oldBlogTitle];
            delete this.blogs.existingBlogs[oldBlogTitle];

            this.blogImages.existingBlogs[newBlogTitle] = [];

            const request = this.blogService.getBlog(newBlogTitle);

            request.subscribe((response: GetBlogApiEndpointResponse) => {
                if (response.error || response.data === null) {
                    this.notificationService.error("Fehler beim Laden des Blogs", `Der Blog '${newBlogTitle}' konnte nicht geladen werden: ` + response.message);

                    // Set a Warning as the sites content
                    this.blogs.existingBlogs[newBlogTitle].set({
                        data: [],
                        metadata: {
                            title: "Fehler beim Laden der Seite",
                            subtitle: "",
                            author: "",
                            imageUrl: PUBLIC_CONFIG.FALLBACK_IMAGE_URL,
                            imageAlt: "",
                        },
                    });

                    this.currentActiveBlogEdit.set(newBlogTitle);

                    return;
                }

                this.blogs.existingBlogs[newBlogTitle] = signal<BlogContent>(response.data.data);

                this.currentActiveBlogEdit.set(newBlogTitle);
            });
        });
    }

    async submitNewNews(): Promise<void> {
        this.submitEditsButton.set("Speichern...");

        const shouldSendNewsletter = await this.awaitConfirmation("Newsletter versenden?", "Möchtest du einen Newsletter an alle Abonnenten versenden, um sie über die neue News zu informieren?", "Ja", "Nein");

        const request = this.newsService.createNews(this.news.newNews().data, this.newsImages.newNews, shouldSendNewsletter);

        request.subscribe((response: ApiEndpointResponse) => {
            this.submitEditsButton.set("Abschliessen");

            this.getAllNews();

            if (response.error) {
                this.notificationService.error("Fehler beim Erstellen", "Die News konnten nicht erstellt werden: " + response.message);

                return;
            }

            this.notificationService.success("News erstellt", response.message);

            // Reset the newsEdits
            this.currentActiveNewsEdit.set("awaitSelection");

            this.newsImages.newNews = [];
            this.news.newNews = signal<News>({ id: -1, date: "1900/12/22", data: { type: "image", imageUrl: PUBLIC_CONFIG.FALLBACK_IMAGE_URL, imageAlt: "", imagePosition: "center", content: [] } });
        });
    }

    async submitNewsEdits(): Promise<void> {
        this.submitEditsButton.set("Speichern...");

        const currentNews = this.news.existingNews[this.currentActiveNewsEdit()]();
        const currentNewsImages = this.newsImages.existingNews[this.currentActiveNewsEdit()];

        const shouldSendNewsletter = await this.awaitConfirmation("Newsletter versenden?", "Möchtest du einen Newsletter an alle Abonnenten versenden, um sie über die neue News zu informieren?", "Ja", "Nein");

        const request = this.newsService.updateNews(currentNews.id, currentNews.data, currentNewsImages, shouldSendNewsletter);

        request.subscribe((response: ApiEndpointResponse) => {
            this.submitEditsButton.set("Abschliessen");

            this.getAllNews();

            if (response.error) {
                this.notificationService.error("Fehler beim Aktualisieren", "Die News konnten nicht aktualisiert werden: " + response.message);

                return;
            }

            this.notificationService.success("News aktualisiert", response.message);

            // Reset the newsEdits
            this.currentActiveNewsEdit.set("awaitSelection");
        });
    }

    /*
     * ===============================================================
     *              EDIT FUNCTION GENERATOR FUNCTION
     * ===============================================================
     */

    generateEditFunction(type: DashboardEditTypes): Function {
        const _this = this;

        const editFunction = async () => {
            if (!isPlatformBrowser(_this.platformId)) {
                console.error("Site editing functions can only be executed in the browser.");
                return;
            }

            _this.currentActionToPerform.set(type);

            if (type === "addTitle" || type === "addNewsTitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set("Titel eingeben:");
                _this.titleInputDescription.set("Bitte gib den Titel ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");
                _this.titleInputLabel.set("Titel:");
                _this.titleInputPlaceholder.set("Titel eingeben");
            } else if (type === "addSubtitle" || type === "addNewsSubtitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set("Untertitel eingeben:");
                _this.titleInputDescription.set("Bitte gib den Untertitel ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");
                _this.titleInputLabel.set("Untertitel:");
                _this.titleInputPlaceholder.set("Untertitel eingeben");
            } else if (type === "addParagraph" || type === "addImageWithText" || type === "addNewsParagraph") {
                _this.textInputOpen.set(true);
            } else if (type === "addImage") {
                _this.imageEditInputOpen.set(true);

                _this.imageEditInputTitle.set("Bild auswählen:");
                _this.imageEditInputDescription.set("Bitte wähle ein Bild aus, dass du verwenden möchtest. Du kannst es auch nachher noch bearbeiten.");
                _this.imageEditInputLabel.set("Bild:");

                _this.imageEditInputPlaceholderUrl.set(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);
            } else if (type === "addMultipleImages") {
                _this.multipleImagesInputOpen.set(true);
            } else if (type === "addLine") {
                const element = _this.editService.addLine();

                _this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
                    siteOrBlog.data.unshift(element);

                    return siteOrBlog;
                });
            } else if (type === "addCurrentTeam") {
                const request = _this.teamService.getCurrentTeam();

                request.subscribe((response: GetTeamApiEndpointResponse) => {
                    if (response.error || response.data === null) {
                        _this.notificationService.error("Fehler beim Laden des Teams", "Das aktuelle Team konnte nicht geladen werden: " + response.message);

                        return;
                    }

                    const element = _this.editService.addCurrentTeam(response.data.id);

                    _this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
                        siteOrBlog.data.unshift(element);

                        return siteOrBlog;
                    });
                });
            } else if (type === "editGeneralTitle") {
                _this.titleEditInputOpen.set(true);

                _this.titleEditInputTitle.set("Seitentitel eingeben:");
                _this.titleEditInputDescription.set("Bitte gib den Seitentitel ein, den du für die Seite verwenden möchtest.");
                _this.titleEditInputLabel.set("Seitentitel:");
                _this.titleEditInputPlaceholder.set("Seitentitel eingeben");

                _this.titleEditInputValue.set(_this.getCurrentEditSignal()().metadata.title);
            } else if (type === "editGeneralSubtitle") {
                _this.titleEditInputOpen.set(true);

                _this.titleEditInputTitle.set("Seiten Untertitel eingeben:");
                _this.titleEditInputDescription.set("Bitte gib den Seiten Untertitel ein, den du für die Seite verwenden möchtest.");
                _this.titleEditInputLabel.set("Seiten Untertitel:");
                _this.titleEditInputPlaceholder.set("Seiten Untertitel eingeben");

                _this.titleEditInputValue.set(_this.getCurrentEditSignal()().metadata.subtitle);
            } else if (type === "editAuthor") {
                _this.titleEditInputOpen.set(true);

                _this.titleEditInputTitle.set("Autor eingeben:");
                _this.titleEditInputDescription.set("Bitte gib deinen Vor- und Nachnamen ein, der als Autor der Seite angezeigt werden soll.");
                _this.titleEditInputLabel.set("Autor:");
                _this.titleEditInputPlaceholder.set("Autor eingeben");

                _this.titleEditInputValue.set(_this.getCurrentEditSignal()().metadata.author);
            } else if (type === "editTitleImage") {
                _this.imageEditInputOpen.set(true);

                _this.imageEditInputTitle.set("Titelbild auswählen:");
                _this.imageEditInputDescription.set("Bitte wähle ein Bild aus, das du als Titelbild verwenden möchtest.");
                _this.imageEditInputLabel.set("Bild:");

                _this.imageEditInputPlaceholderUrl.set(_this.getCurrentEditSignal()().metadata.imageUrl);
            } else if (type === "addNewsImage") {
                _this.imageEditInputOpen.set(true);

                _this.imageEditInputTitle.set("Bild auswählen:");
                _this.imageEditInputDescription.set("Bitte wähle ein Bild aus, dass du verwenden möchtest.");
                _this.imageEditInputLabel.set("Bild:");

                _this.imageEditInputPlaceholderUrl.set(_this.getCurrentNewsEditSignal()().data.imageUrl || PUBLIC_CONFIG.FALLBACK_IMAGE_URL);
            } else if (type === "addNewsPdf") {
                _this.fileInputOpen.set(true);

                _this.fileInputAccept.set("application/pdf, .pdf");
            } else if (type === "addNewsMultipleImages") {
                _this.multipleImagesInputOpen.set(true);

                _this.multipleImagesEditInputTitle.set("Bilder auswählen:");
                _this.multipleImagesEditInputDescription.set("Bitte wähle Bilder aus, die du verwenden möchtest.");
                _this.multipleImagesEditInputLabel.set("Bilder:");
            } else if (type === "addNewsLine") {
                const element = _this.editService.addLine();

                _this.getCurrentNewsEditSignal().update((news: News): News => {
                    news.data.content.push(element);

                    return news;
                });
            } else {
                _this.notificationService.error("Unbekannte Aktion", "Diese Aktion kann nicht verarbeitet werden.");
            }
        };

        return editFunction;
    }

    /*
     * ===============================================================
     *           CUSTOM ELEMENTS EDIT HANDLER FUNCTIONS
     * ===============================================================
     */

    handleMove(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.getCurrentEditSignal()().data, event.previousIndex, event.currentIndex);
    }

    handleEdit(index: number): void {
        this.currentIndexToEdit.set(index);

        const elementToEdit = this.getCurrentEditSignal()().data[index];

        switch (elementToEdit.type) {
            case "title":
                this.currentActionToPerform.set("editTitle");
                this.titleEditInputOpen.set(true);

                this.titleEditInputTitle.set("Titel bearbeiten:");
                this.titleEditInputDescription.set("Bitte bearbeite den Titel nach Bedarf.");
                this.titleEditInputLabel.set("Titel:");
                this.titleEditInputPlaceholder.set("Titel eingeben");
                this.titleEditInputValue.set(elementToEdit.content);

                break;

            case "subtitle":
                this.currentActionToPerform.set("editSubtitle");
                this.titleEditInputOpen.set(true);

                this.titleEditInputTitle.set("Untertitel bearbeiten:");
                this.titleEditInputDescription.set("Bitte bearbeite den Untertitel nach Bedarf.");
                this.titleEditInputLabel.set("Untertitel:");
                this.titleEditInputPlaceholder.set("Untertitel eingeben");
                this.titleEditInputValue.set(elementToEdit.content);

                break;

            case "paragraph":
                this.currentActionToPerform.set("editParagraph");
                this.textEditInputOpen.set(true);

                this.textEditInputTitle.set("Text bearbeiten:");
                this.textEditInputDescription.set("Bitte bearbeite den Text nach Bedarf.");
                this.textEditInputLabel.set("Text:");
                this.textEditInputPlaceholder.set("Text eingeben");
                this.textEditInputValue.set(elementToEdit.content);

                break;

            case "imageWithText":
                this.currentActionToPerform.set("editImageWithText");
                this.textEditInputOpen.set(true);

                this.textEditInputTitle.set("Text bearbeiten:");
                this.textEditInputDescription.set("Bitte bearbeite den Text nach Bedarf.");
                this.textEditInputLabel.set("Text:");
                this.textEditInputPlaceholder.set("Text eingeben");
                this.textEditInputValue.set(elementToEdit.content);

                this.imageEditInputTitle.set("Bild ändern:");
                this.imageEditInputDescription.set("Bitte wähle ein neues Bild aus, um das aktuelle zu ersetzen. Wenn du das Bild nicht ändern möchtest, kannst du dieses Fenster einfach schliessen.");
                this.imageEditInputLabel.set("Bild:");
                this.imageEditInputPlaceholderUrl.set(elementToEdit.imageUrl);

                break;

            case "image":
                this.currentActionToPerform.set("editImage");
                this.imageEditInputOpen.set(true);

                this.imageEditInputTitle.set("Bild ändern:");
                this.imageEditInputDescription.set("Bitte wähle ein neues Bild aus, um das aktuelle zu ersetzen.");
                this.imageEditInputLabel.set("Bild:");
                this.imageEditInputPlaceholderUrl.set(elementToEdit.imageUrl);

                break;

            case "multipleImages":
                this.currentActionToPerform.set("editMultipleImages");
                this.multipleImagesEditInputOpen.set(true);

                this.multipleImagesEditInputTitle.set("Bilder ändern:");
                this.multipleImagesEditInputDescription.set("Bitte wähle neue Bilder aus, um die aktuellen zu ersetzen. Du kannst ausserdem einzelne Bilder hinzufügen oder entfernen oder einfach die Reihenfolge verändern.");
                this.multipleImagesEditInputLabel.set("Bilder:");
                this.multipleImagesEditInputValue.set(elementToEdit.images);

                break;

            default:
                this.notificationService.error("Unbekanntes Element", "Dieses Element kann nicht bearbeitet werden.");
                break;
        }
    }

    async handleDelete(index: number): Promise<void> {
        const confirmDeletion = await this.awaitConfirmation("Löschen bestätigen", "Möchtest du dieses Element wirklich löschen?", "Löschen", "Abbrechen");

        if (!confirmDeletion) {
            return;
        }

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.splice(index, 1);

            return siteOrBlog;
        });
    }

    handleNewsMove(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.getCurrentNewsEditSignal()().data.content, event.previousIndex, event.currentIndex);
    }

    handleNewsEdit(index: number): void {
        this.currentIndexToEdit.set(index);

        const elementToEdit = this.getCurrentNewsEditSignal()().data.content[index];

        switch (elementToEdit.type) {
            case "title":
                this.currentActionToPerform.set("editNewsTitle");
                this.titleEditInputOpen.set(true);

                this.titleEditInputTitle.set("Titel bearbeiten:");
                this.titleEditInputDescription.set("Bitte bearbeite den Titel nach Bedarf.");
                this.titleEditInputLabel.set("Titel:");
                this.titleEditInputPlaceholder.set("Titel eingeben");
                this.titleEditInputValue.set(elementToEdit.content);

                break;

            case "subtitle":
                this.currentActionToPerform.set("editNewsSubtitle");
                this.titleEditInputOpen.set(true);

                this.titleEditInputTitle.set("Untertitel bearbeiten:");
                this.titleEditInputDescription.set("Bitte bearbeite den Untertitel nach Bedarf.");
                this.titleEditInputLabel.set("Untertitel:");
                this.titleEditInputPlaceholder.set("Untertitel eingeben");
                this.titleEditInputValue.set(elementToEdit.content);

                break;

            case "paragraph":
                this.currentActionToPerform.set("editNewsParagraph");
                this.textEditInputOpen.set(true);

                this.textEditInputTitle.set("Text bearbeiten:");
                this.textEditInputDescription.set("Bitte bearbeite den Text nach Bedarf.");
                this.textEditInputLabel.set("Text:");
                this.textEditInputPlaceholder.set("Text eingeben");
                this.textEditInputValue.set(elementToEdit.content);

                break;

            case "multipleImages":
                this.currentActionToPerform.set("editNewsMultipleImages");
                this.multipleImagesEditInputOpen.set(true);

                this.multipleImagesEditInputTitle.set("Bilder ändern:");
                this.multipleImagesEditInputDescription.set("Bitte wähle neue Bilder aus, um die aktuellen zu ersetzen. Du kannst ausserdem einzelne Bilder hinzufügen oder entfernen oder einfach die Reihenfolge verändern.");
                this.multipleImagesEditInputLabel.set("Bilder:");
                this.multipleImagesEditInputValue.set(elementToEdit.images);

                break;

            default:
                this.notificationService.error("Unbekanntes Element", "Dieses Element kann nicht bearbeitet werden.");
                break;
        }
    }

    async handleNewsDelete(index: number): Promise<void> {
        const confirmDeletion = await this.awaitConfirmation("Löschen bestätigen", "Möchtest du dieses Element wirklich löschen?", "Löschen", "Abbrechen");

        if (!confirmDeletion) {
            return;
        }

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.content.splice(index, 1);

            return news;
        });
    }

    /*
     * ===============================================================
     *                    INPUT HANDLER FUNCTIONS
     * ===============================================================
     */

    handleTitleInputResult(content: string): void {
        this.titleInputOpen.set(false);
        this.titleEditInputOpen.set(false);

        switch (this.currentActionToPerform()) {
            case "addTitle":
                this.addTitle(content);
                break;
            case "editTitle":
                this.editTitle(content);
                break;
            case "addSubtitle":
                this.addSubtitle(content);
                break;
            case "editSubtitle":
                this.editSubtitle(content);
                break;
            case "editGeneralTitle":
                this.editGeneralTitle(content);
                break;
            case "editGeneralSubtitle":
                this.editGeneralSubtitle(content);
                break;
            case "editAuthor":
                this.editAuthor(content);
                break;
            case "addNewsTitle":
                this.addNewsTitle(content);
                break;
            case "editNewsTitle":
                this.editNewsTitle(content);
                break;
            case "addNewsSubtitle":
                this.addNewsSubtitle(content);
                break;
            case "editNewsSubtitle":
                this.editNewsSubtitle(content);
                break;
            default:
                this.notificationService.error("Unbekannte Aktion", "Diese Aktion kann nicht mit dem aktuellen Popup verarbeitet werden.");
                break;
        }
    }

    handleTextInputResult(content: string): void {
        this.textInputOpen.set(false);
        this.textEditInputOpen.set(false);

        switch (this.currentActionToPerform()) {
            case "addParagraph":
                this.addParagraph(content);
                break;
            case "editParagraph":
                this.editParagraph(content);
                break;
            case "addImageWithText":
                this.addImageWithTextPart1(content);
                break;
            case "editImageWithText":
                this.editImageWithTextPart1(content);
                break;
            case "addNewsParagraph":
                this.addNewsParagraph(content);
                break;
            case "editNewsParagraph":
                this.editNewsParagraph(content);
                break;
            default:
                this.notificationService.error("Unbekannte Aktion", "Diese Aktion kann nicht mit dem aktuellen Popup verarbeitet werden.");
                break;
        }
    }

    handleSelectionInputResult(selectedOption: string): void {
        this.selectionInputOpen.set(false);

        console.log("Selected option:", selectedOption);

        switch (this.currentActiveSection()) {
            case "blog-edit-blog":
                this.currentActiveBlogEdit.set(selectedOption);
                break;
            case "blog-delete-blog":
                this.deleteBlog(selectedOption);
                break;
            case "news-edit-news":
                if (this.allEditableNews.includes(selectedOption)) {
                    this.currentActiveNewsEdit.set(selectedOption);
                } else {
                    this.selectionInputObservable.next(selectedOption);
                }
                break;
            case "calendar-delete-event":
                this.deleteEvent(selectedOption);
                break;
            default:
                this.selectionInputObservable.next(selectedOption);
                break;
        }
    }

    handleImageInputResult(file: { file: File | null; url: string }): void {
        this.imageInputOpen.set(false);
        this.imageEditInputOpen.set(false);

        if (file.file === null) {
            this.notificationService.info("Kein Bild ausgewählt", "Bitte wähle ein Bild aus, um diese Funktion zu nutzen.");

            return;
        }

        switch (this.currentActionToPerform()) {
            case "addImage":
                this.addImage(file as { file: File; url: string });
                break;
            case "editImage":
                this.editImage(file as { file: File; url: string });
                break;
            case "addImageWithText":
                this.addImageWithTextPart2(file as { file: File; url: string });
                break;
            case "editImageWithText":
                this.editImageWithTextPart2(file as { file: File; url: string });
                break;
            case "editTitleImage":
                this.editGeneralImage(file as { file: File; url: string });
                break;
            case "addNewsImage":
                this.addNewsImage(file as { file: File; url: string });
                break;
            default:
                this.notificationService.error("Unbekannte Aktion", "Diese Aktion kann nicht mit dem aktuellen Popup verarbeitet werden.");
                break;
        }
    }

    handleFileInputResult(file: File | null): void {
        this.fileInputOpen.set(false);

        if (file === null) {
            this.notificationService.info("Keine Datei ausgewählt", "Bitte wähle eine Datei aus, um diese Funktion zu nutzen.");

            return;
        }

        switch (this.currentActionToPerform()) {
            case "addNewsPdf":
                this.addNewsPdf(file);
                break;
            default:
                this.notificationService.error("Unbekannte Aktion", "Diese Aktion kann nicht mit dem aktuellen Popup verarbeitet werden.");
                break;
        }
    }

    handleMultipleImagesInputResult(files: { file: File; url: string }[]): void {
        this.multipleImagesInputOpen.set(false);
        this.multipleImagesEditInputOpen.set(false);

        switch (this.currentActionToPerform()) {
            case "addMultipleImages":
                this.addMultipleImages(files);
                break;
            case "editMultipleImages":
                this.editMultipleImages(files);
                break;
            case "addNewsMultipleImages":
                this.addNewsMultipleImages(files);
                break;
            case "editNewsMultipleImages":
                this.editNewsMultipleImages(files);
                break;
            default:
                this.notificationService.error("Unbekannte Aktion", "Diese Aktion kann nicht mit dem aktuellen Popup verarbeitet werden.");
                break;
        }
    }

    handleConfirmInputResult(confirmed: boolean): void {
        this.confirmInputOpen.set(false);

        this.confirmInputObservable.next(confirmed);
    }

    /*
     * ===============================================================
     *                 ADD CUSTOM ELEMENTS FUNCTIONS
     * ===============================================================
     */

    addTitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Titel wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editService.addTitle(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
        });
    }

    addNewsTitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Titel wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editService.addTitle(content);

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.content.push(element);

            return news;
        });
    }

    addSubtitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Untertitel wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editService.addSubtitle(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
        });
    }

    addNewsSubtitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Untertitel wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editService.addSubtitle(content);

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.content.push(element);

            return news;
        });
    }

    addParagraph(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Text wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editService.addParagraph(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
        });
    }

    addNewsParagraph(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Text wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editService.addParagraph(content);

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.content.push(element);

            return news;
        });
    }

    addImage(file: { file: File; url: string }): void {
        this.getCurrentImageStorage().push(file);

        const element = this.editService.addImage(file.url, file.file.name);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
        });
    }

    async addNewsImage(file: { file: File; url: string }): Promise<void> {
        this.getCurrentImageStorage().push(file);

        const element = this.editService.addImage(file.url, file.file.name);

        const sideOfImage = (await this.awaitSelection(
            ["Links", "In der Mitte", "Rechts"],
            "Seite wählen:",
            "Wo ist der wichtigste Teil des Bildes? Dies hilft uns, das Bild auf verschiedenen Bildschirmgrössen optimal zuzuschneiden.",
            "Position:",
            "In der Mitte",
        )) as "Links" | "In der Mitte" | "Rechts";

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.content = news.data.content.filter((contentElement): boolean => contentElement.type !== "multipleImages");

            news.data.type = "image";
            news.data.imagePosition = sideOfImage.replace("In der Mitte", "center").replace("Links", "left").replace("Rechts", "right") as "left" | "center" | "right";
            news.data.imageUrl = element.imageUrl;
            news.data.imageAlt = element.imageAlt;

            return news;
        });
    }

    addImageWithTextPart1(content: string): void {
        // Add the content to a cache variable and open the image input popup

        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Text wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        this.textWithImageTextCache.set(content);

        this.currentActionToPerform.set("addImageWithText");
        this.imageInputOpen.set(true);
    }

    async addImageWithTextPart2(file: { file: File; url: string }): Promise<void> {
        // Get the content from the cache variable and add the element
        const shouldImageBePlacedRight = await this.awaitConfirmation("Seite wählen", "Möchtest du das Bild links oder rechts platzieren?", "Rechts", "Links", true);

        this.getCurrentImageStorage().push(file);

        const element = this.editService.addImageWithText(file.url, file.file.name, this.textWithImageTextCache(), shouldImageBePlacedRight ? "right" : "left");

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
        });
    }

    addMultipleImages(files: { file: File; url: string }[]): void {
        if (files.length === 0) {
            this.notificationService.info("Keine Bilder ausgewählt", "Bitte wähle mindestens ein Bild aus, um diese Funktion zu nutzen.");
            return;
        }

        const images: { imageUrl: string; imageAlt: string }[] = [];

        for (const file of files) {
            this.getCurrentImageStorage().push(file);

            images.push({
                imageUrl: file.url,
                imageAlt: file.file.name,
            });
        }

        const element = this.editService.addMultipleImages(images);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
        });
    }

    addNewsMultipleImages(files: { file: File; url: string }[]): void {
        if (files.length === 0) {
            this.notificationService.info("Keine Bilder ausgewählt", "Bitte wähle mindestens ein Bild aus, um diese Funktion zu nutzen.");
            return;
        }

        const images: { imageUrl: string; imageAlt: string }[] = [];

        for (const file of files) {
            this.getCurrentImageStorage().push(file);

            images.push({
                imageUrl: file.url,
                imageAlt: file.file.name,
            });
        }

        const element = this.editService.addMultipleImages(images);

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.type = "multipleImages";

            news.data.content = news.data.content.filter((contentElement): boolean => contentElement.type !== "multipleImages");

            news.data.content.push(element);

            return news;
        });
    }

    addNewsPdf(file: File): void {
        if (file.type !== "application/pdf") {
            this.notificationService.info("Ungültige Datei", "Bitte wähle eine PDF-Datei aus, um diese Funktion zu nutzen.");
            return;
        }

        const fileUrl = URL.createObjectURL(file);

        this.getCurrentImageStorage().push({ file, url: fileUrl });

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.content = news.data.content.filter((contentElement): boolean => contentElement.type !== "multipleImages");

            news.data.type = "pdf";
            news.data.pdfUrl = fileUrl;

            return news;
        });
    }

    /*
     * ===============================================================
     *                EDIT CUSTOM ELEMENTS FUNCTIONS
     * ===============================================================
     */

    editGeneralTitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Seitentitel wurde nicht aktualisiert, da kein Inhalt eingegeben wurde.");
            return;
        }

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.metadata.title = content;

            return siteOrBlog;
        });
    }

    editGeneralSubtitle(content: string): void {
        // Allow empty subtitle

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.metadata.subtitle = content ? content : "";

            return siteOrBlog;
        });
    }

    editGeneralImage(file: { file: File; url: string }): void {
        this.getCurrentImageStorage().push(file);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.metadata.imageUrl = file.url;
            siteOrBlog.metadata.imageAlt = file.file.name;

            return siteOrBlog;
        });
    }

    editAuthor(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Autor wurde nicht aktualisiert, da kein Inhalt eingegeben wurde.");
            return;
        }

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.metadata.author = content;

            return siteOrBlog;
        });
    }

    editTitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Titel wurde nicht aktualisiert, da kein Inhalt eingegeben wurde. Wenn du das Element löschen möchtest, benutze bitte die Lösch-Funktion.");
            return;
        }

        const element = this.editService.addTitle(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data[this.currentIndexToEdit()] = element;

            return siteOrBlog;
        });
    }

    editNewsTitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Titel wurde nicht aktualisiert, da kein Inhalt eingegeben wurde. Wenn du das Element löschen möchtest, benutze bitte die Lösch-Funktion.");
            return;
        }

        const element = this.editService.addTitle(content);

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.content[this.currentIndexToEdit()] = element;

            return news;
        });
    }

    editSubtitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Untertitel wurde nicht aktualisiert, da kein Inhalt eingegeben wurde. Wenn du das Element löschen möchtest, benutze bitte die Lösch-Funktion.");
            return;
        }

        const element = this.editService.addSubtitle(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data[this.currentIndexToEdit()] = element;

            return siteOrBlog;
        });
    }

    editNewsSubtitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Untertitel wurde nicht aktualisiert, da kein Inhalt eingegeben wurde. Wenn du das Element löschen möchtest, benutze bitte die Lösch-Funktion.");
            return;
        }

        const element = this.editService.addSubtitle(content);

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.content[this.currentIndexToEdit()] = element;

            return news;
        });
    }

    editParagraph(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Text wurde nicht aktualisiert, da kein Inhalt eingegeben wurde. Wenn du das Element löschen möchtest, benutze bitte die Lösch-Funktion.");
            return;
        }

        const element = this.editService.addParagraph(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data[this.currentIndexToEdit()] = element;

            return siteOrBlog;
        });
    }

    editNewsParagraph(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Text wurde nicht aktualisiert, da kein Inhalt eingegeben wurde. Wenn du das Element löschen möchtest, benutze bitte die Lösch-Funktion.");
            return;
        }

        const element = this.editService.addParagraph(content);

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.content[this.currentIndexToEdit()] = element;

            return news;
        });
    }

    editImage(file: { file: File; url: string }): void {
        if (!file.url.startsWith("blob:")) {
            this.notificationService.info("Keine Veränderung", "Das Bild wurde nicht aktualisiert, da kein neues Bild ausgewählt wurde.");

            return;
        }

        this.getCurrentImageStorage().push(file);

        const element = this.editService.addImage(file.url, file.file.name);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data[this.currentIndexToEdit()] = element;

            return siteOrBlog;
        });
    }

    editImageWithTextPart1(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Text wurde nicht aktualisiert, da kein Inhalt eingegeben wurde. Wenn du das Element löschen möchtest, benutze bitte die Lösch-Funktion.");
            return;
        }

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            (siteOrBlog.data[this.currentIndexToEdit()] as CustomImageWithTextElement).content = content;

            return siteOrBlog;
        });

        this.currentActionToPerform.set("editImageWithText");

        this.imageEditInputOpen.set(true);
    }

    async editImageWithTextPart2(file: { file: File; url: string }): Promise<void> {
        if (!file.url.startsWith("blob:")) {
            const shouldImageBePlacedRight = await this.awaitConfirmation("Seite wählen", "Möchtest du das Bild links oder rechts platzieren?", "Rechts", "Links", true);

            this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
                (siteOrBlog.data[this.currentIndexToEdit()] as CustomImageWithTextElement).sideOfImage = shouldImageBePlacedRight ? "right" : "left";

                return siteOrBlog;
            });

            this.notificationService.info("Teilweise Veränderung", "Nur der Text wurde aktualisiert. Das Bild nicht, da kein Neues ausgewählt wurde.");

            return;
        }

        this.getCurrentImageStorage().push(file);

        const shouldImageBePlacedRight = await this.awaitConfirmation("Seite wählen", "Möchtest du das Bild links oder rechts platzieren?", "Rechts", "Links", true);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            (siteOrBlog.data[this.currentIndexToEdit()] as CustomImageWithTextElement).imageUrl = file.url;
            (siteOrBlog.data[this.currentIndexToEdit()] as CustomImageWithTextElement).imageAlt = file.file.name;
            (siteOrBlog.data[this.currentIndexToEdit()] as CustomImageWithTextElement).sideOfImage = shouldImageBePlacedRight ? "right" : "left";

            return siteOrBlog;
        });
    }

    editMultipleImages(files: { file: File; url: string }[]): void {
        if (files.length === 0) {
            this.notificationService.info("Keine Bilder ausgewählt", "Die Bilder wurden nicht aktualisiert, da keine neuen Bilder ausgewählt wurden. Wenn du die Bilder löschen möchtest, benutze bitte die Lösch-Funktion.");
            return;
        }

        const images: { imageUrl: string; imageAlt: string }[] = [];

        for (const file of files) {
            if (file.url.startsWith("blob:")) {
                this.getCurrentImageStorage().push(file);
            }

            images.push({
                imageUrl: file.url,
                imageAlt: file.file?.name ?? "Keine Bezeichnung",
            });
        }

        const element = this.editService.addMultipleImages(images);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data[this.currentIndexToEdit()] = element;

            return siteOrBlog;
        });
    }

    editNewsMultipleImages(files: { file: File; url: string }[]): void {
        if (files.length === 0) {
            this.notificationService.info("Keine Bilder ausgewählt", "Bitte wähle mindestens ein Bild aus, um diese Funktion zu nutzen.");
            return;
        }

        const images: { imageUrl: string; imageAlt: string }[] = [];

        for (const file of files) {
            if (file.url.startsWith("blob:")) {
                this.getCurrentImageStorage().push(file);
            }

            images.push({
                imageUrl: file.url,
                imageAlt: file.file?.name ?? "Keine Bezeichnung",
            });
        }

        const element = this.editService.addMultipleImages(images);

        this.getCurrentNewsEditSignal().update((news: News): News => {
            news.data.content[this.currentIndexToEdit()] = element;

            return news;
        });
    }

    /*
     * ===============================================================
     *                    INSTANT USE FUNCTIONS
     * ===============================================================
     */

    async deleteBlog(blogName: string): Promise<void> {
        const confirm = await this.awaitConfirmation("Löschen bestätigen", `Möchtest du den Blog mit Titel '${blogName}' wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`, "Löschen", "Abbrechen");

        if (!confirm) {
            this.setCurrentActiveNavigation("main");
            this.currentActiveSection.set("stats-website-analytics");

            return;
        }

        const request = this.blogService.deleteBlog(blogName);

        request.subscribe((response: ApiEndpointResponse) => {
            if (response.error) {
                this.notificationService.error("Fehler beim Löschen", "Der Blog konnte nicht gelöscht werden: " + response.message);

                this.setCurrentActiveNavigation("main");
                this.currentActiveSection.set("stats-website-analytics");

                return;
            }

            this.notificationService.success("Blog gelöscht", response.message);

            // Refresh the blog titles
            this.getAllBlogTitles();

            // Reset the current active blog edit if it was the deleted blog
            if (this.currentActiveBlogEdit() === blogName) {
                this.currentActiveBlogEdit.set("awaitSelection");
            }

            this.setCurrentActiveNavigation("main");
            this.currentActiveSection.set("stats-website-analytics");
        });
    }

    async deleteEvent(formattedEvent: string): Promise<void> {
        const confirm = await this.awaitConfirmation("Löschen bestätigen", `Möchtest du den Event '${formattedEvent}' wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`, "Löschen", "Abbrechen");

        if (!confirm) {
            this.setCurrentActiveNavigation("main");
            this.currentActiveSection.set("stats-website-analytics");

            return;
        }

        // Since we only have the formatted event, we have to find the corresponding event ID first

        const getEventId = (formattedEvent: string): number => {
            for (const event of this.calendarEvents) {
                if (`${formatDateRangeString(new Date(event.startDate), new Date(event.endDate))} - ${event.title}` === formattedEvent) {
                    return event.id;
                }
            }

            return -1; // Return -1 if no matching event is found
        };

        const eventId = getEventId(formattedEvent);

        if (eventId === -1) {
            this.notificationService.error("Event nicht gefunden", "Der Event konnte nicht gefunden werden. Bitte aktualisiere die Seite und versuche es erneut.");

            this.setCurrentActiveNavigation("main");
            this.currentActiveSection.set("stats-website-analytics");

            return;
        }

        const request = this.calendarService.deleteEvent(eventId);

        request.subscribe((response: ApiEndpointResponse) => {
            if (response.error) {
                this.notificationService.error("Fehler beim Löschen", "Das Event konnte nicht gelöscht werden: " + response.message);

                this.setCurrentActiveNavigation("main");
                this.currentActiveSection.set("stats-website-analytics");

                return;
            }

            this.notificationService.success("Event gelöscht", "Das Event wurde erfolgreich gelöscht.");

            // Refresh the events
            this.getAllEvents();

            this.setCurrentActiveNavigation("main");
            this.currentActiveSection.set("stats-website-analytics");
        });
    }
}
