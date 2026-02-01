import { Component, inject, OnInit, PLATFORM_ID, signal, WritableSignal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Subject, take } from "rxjs";
import {
    ApiEndpointResponse,
    BlogContent,
    CustomImageWithTextElement,
    DashboardNavigationOptions,
    DatabaseApiEndpointResponse,
    GetAllBlogsApiEndpointResponse,
    GetAllStaticSitesApiEndpointResponse,
    GetStaticSiteApiEndpointResponse,
    GetTeamApiEndpointResponse,
    StaticSite,
    StaticSiteNames,
} from "../../..";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { TeamService } from "../../services/team.service";
import { BlogService } from "../../services/blog.service";
import { SubpagesService } from "../../services/subpages.service";
import { EditSiteService } from "../../services/edit-site.service";
import { NotificationService } from "../../services/notification.service";
import { AdminNavElementComponent } from "../components/admin-nav-element/admin-nav-element.component";
import { AdminPasswordsPageComponent } from "../components/admin-passwords-page/admin-passwords-page.component";
import { AdminHomepagePicturePageComponent } from "../components/admin-homepage-picture-page/admin-homepage-picture-page.component";
import { EditStaticSiteComponent } from "../components/edit-static-site/edit-static-site.component";
import { AdminAddAdminComponent } from "../components/admin-add-admin/admin-add-admin.component";
import { AdminRemoveAdminComponent } from "../components/admin-remove-admin/admin-remove-admin.component";
import { BlogDeleteBlogComponent } from "../components/blog-delete-blog/blog-delete-blog.component";
import { NewsCreateNewsComponent } from "../components/news-create-news/news-create-news.component";
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
import { CalendarDeleteEventComponent } from "../components/calendar-delete-event/calendar-delete-event.component";
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

@Component({
    selector: "app-dashboard",
    imports: [
        AdminNavElementComponent,
        AdminPasswordsPageComponent,
        AdminHomepagePicturePageComponent,
        EditStaticSiteComponent,
        AdminAddAdminComponent,
        AdminRemoveAdminComponent,
        BlogDeleteBlogComponent,
        NewsCreateNewsComponent,
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
        CalendarDeleteEventComponent,
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

    /*
     * ===============================================================
     *                        ACTIVE SIGNALS
     * ===============================================================
     */

    currentActiveSection = signal<string>("stats-website-analytics");
    currentActiveNavigation = signal<DashboardNavigationOptions>("main");
    currentActiveSiteEdit = signal<StaticSiteNames>("vision");
    currentActiveBlogEdit = signal<string>("awaitSelection");
    currentActionToPerform = signal<
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
    >("addTitle");
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
     *                          SERVICES
     * ===============================================================
     */

    private teamService = inject(TeamService);
    private blogService = inject(BlogService);
    private editSiteService = inject(EditSiteService);
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
        const blogsRequest = this.blogService.getAllBlogLinks();

        blogsRequest.subscribe((response: DatabaseApiEndpointResponse) => {
            if (response.error || response.data?.data === null || !Array.isArray(response.data?.data)) {
                this.notificationService.error("Fehler beim Laden der Blogs", "Die Blogs konnten nicht geladen werden: " + response.message);

                return;
            }

            for (const blog of response.data.data) {
                this.allEditableBlogs.push(blog["title"]);
            }
        });

        // Get all blogs for editing
        const getAllBlogsRequest = this.blogService.getAllBlogs();

        getAllBlogsRequest.subscribe((response: GetAllBlogsApiEndpointResponse) => {
            if (response.error || response.data === null) {
                this.notificationService.error("Fehler beim Laden der Blogs", "Die Blogs konnten nicht geladen werden: " + response.message);

                return;
            }

            for (const blog of response.data) {
                this.blogs.existingBlogs[blog.title] = signal<BlogContent>(blog.data);
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

    getCurrentImageStorage(): { url: string; file: File }[] {
        switch (this.currentActiveNavigation()) {
            case "edit-sites":
                return this.siteEditImages[this.currentActiveSiteEdit()];
            case "edit-blog":
                return this.blogImages.existingBlogs[this.currentActiveBlogEdit()];
            case "create-blog":
                return this.blogImages.newBlog;
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
        }
    }

    submitSiteEdits(): void {
        this.submitEditsButton.set("Speichern...");

        const request = this.editSiteService.submitSite(this.currentActiveSiteEdit(), this.siteEdits[this.currentActiveSiteEdit()](), this.siteEditImages[this.currentActiveSiteEdit()]);

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

        this.showAlert("Funktion nicht implementiert", "Die Funktion zum Erstellen eines neuen Blogs ist noch nicht implementiert.", "OK");
    }

    submitBlogEdits(): void {
        this.submitEditsButton.set("Speichern...");

        this.showAlert("Funktion nicht implementiert", "Die Funktion zum Erstellen eines neuen Blogs ist noch nicht implementiert.", "OK");
    }

    /*
     * ===============================================================
     *              EDIT FUNCTION GENERATOR FUNCTION
     * ===============================================================
     */

    generateEditFunction(
        type: "addTitle" | "addSubtitle" | "addParagraph" | "editGeneralTitle" | "editGeneralSubtitle" | "editAuthor" | "editTitleImage" | "addImage" | "addMultipleImages" | "addImageWithText" | "addLine" | "addCurrentTeam",
    ): Function {
        const _this = this;

        const editFunction = async () => {
            if (!isPlatformBrowser(_this.platformId)) {
                console.error("Site editing functions can only be executed in the browser.");
                return;
            }

            _this.currentActionToPerform.set(type);

            if (type === "addTitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set("Titel eingeben:");
                _this.titleInputDescription.set("Bitte gib den Titel ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");
                _this.titleInputLabel.set("Titel:");
                _this.titleInputPlaceholder.set("Titel eingeben");
            } else if (type === "addSubtitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set("Untertitel eingeben:");
                _this.titleInputDescription.set("Bitte gib den Untertitel ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.");
                _this.titleInputLabel.set("Untertitel:");
                _this.titleInputPlaceholder.set("Untertitel eingeben");
            } else if (type === "addParagraph" || type === "addImageWithText") {
                _this.textInputOpen.set(true);
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
            } else if (type === "editTitleImage" || type === "addImage") {
                _this.imageEditInputOpen.set(true);

                _this.imageEditInputTitle.set("Titelbild auswählen:");
                _this.imageEditInputDescription.set("Bitte wähle ein Bild aus, das du als Titelbild verwenden möchtest.");
                _this.imageEditInputLabel.set("Bild:");

                _this.imageEditInputPlaceholderUrl.set(_this.getCurrentEditSignal()().metadata.imageUrl);
            } else if (type === "addMultipleImages") {
                _this.multipleImagesInputOpen.set(true);
            } else if (type === "addLine") {
                const element = _this.editSiteService.addLine();

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

                    const element = _this.editSiteService.addCurrentTeam(response.data.id);

                    _this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
                        siteOrBlog.data.unshift(element);

                        return siteOrBlog;
                    });
                });
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
            default:
                this.notificationService.error("Unbekannte Aktion", "Diese Aktion kann nicht mit dem aktuellen Popup verarbeitet werden.");
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

        const element = this.editSiteService.addTitle(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
        });
    }

    addSubtitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Untertitel wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editSiteService.addSubtitle(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
        });
    }

    addParagraph(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Text wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editSiteService.addParagraph(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
        });
    }

    addImage(file: { file: File; url: string }): void {
        this.getCurrentImageStorage().push(file);

        const element = this.editSiteService.addImage(file.url, file.file.name);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
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

        const element = this.editSiteService.addImageWithText(file.url, file.file.name, this.textWithImageTextCache(), shouldImageBePlacedRight ? "right" : "left");

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

        const element = this.editSiteService.addMultipleImages(images);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data.unshift(element);

            return siteOrBlog;
        });
    }

    /*
     * ===============================================================
     *                Edit CUSTOM ELEMENTS FUNCTIONS
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

        const element = this.editSiteService.addTitle(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data[this.currentIndexToEdit()] = element;

            return siteOrBlog;
        });
    }

    editSubtitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Untertitel wurde nicht aktualisiert, da kein Inhalt eingegeben wurde. Wenn du das Element löschen möchtest, benutze bitte die Lösch-Funktion.");
            return;
        }

        const element = this.editSiteService.addSubtitle(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data[this.currentIndexToEdit()] = element;

            return siteOrBlog;
        });
    }

    editParagraph(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Text wurde nicht aktualisiert, da kein Inhalt eingegeben wurde. Wenn du das Element löschen möchtest, benutze bitte die Lösch-Funktion.");
            return;
        }

        const element = this.editSiteService.addParagraph(content);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data[this.currentIndexToEdit()] = element;

            return siteOrBlog;
        });
    }

    editImage(file: { file: File; url: string }): void {
        if (!file.url.startsWith("blob:")) {
            this.notificationService.info("Keine Veränderung", "Das Bild wurde nicht aktualisiert, da kein neues Bild ausgewählt wurde.");

            return;
        }

        this.getCurrentImageStorage().push(file);

        const element = this.editSiteService.addImage(file.url, file.file.name);

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

        const element = this.editSiteService.addMultipleImages(images);

        this.getCurrentEditSignal().update((siteOrBlog: StaticSite | BlogContent): StaticSite | BlogContent => {
            siteOrBlog.data[this.currentIndexToEdit()] = element;

            return siteOrBlog;
        });
    }
}
