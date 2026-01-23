import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { ApiEndpointResponse, DashboardNavigationOptions, GetStaticSiteApiEndpointResponse, StaticSite, StaticSiteNames } from "../../..";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { EditSiteService } from "../../services/edit-site.service";
import { NotificationService } from "../../services/notification.service";
import { SubpagesService } from "../../services/subpages.service";
import { AdminNavElementComponent } from "../components/admin-nav-element/admin-nav-element.component";
import { AdminUnknownPageComponent } from "../components/admin-unknown-page/admin-unknown-page.component";
import { AdminPasswordsPageComponent } from "../components/admin-passwords-page/admin-passwords-page.component";
import { AdminHomepagePicturePageComponent } from "../components/admin-homepage-picture-page/admin-homepage-picture-page.component";
import { EditStaticSiteComponent } from "../components/edit-static-site/edit-static-site.component";
import { AdminAddAdminComponent } from "../components/admin-add-admin/admin-add-admin.component";
import { AdminRemoveAdminComponent } from "../components/admin-remove-admin/admin-remove-admin.component";
import { BlogCreateBlogComponent } from "../components/blog-create-blog/blog-create-blog.component";
import { BlogEditBlogComponent } from "../components/blog-edit-blog/blog-edit-blog.component";
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
import { PopupTitleInputComponent } from "../components/popup-title-input/popup-title-input.component";
import { PopupTextInputComponent } from "../components/popup-text-input/popup-text-input.component";
import { PopupImageInputComponent } from "../components/popup-image-input/popup-image-input.component";
import { PopupMultipleImagesInputComponent } from "../components/popup-multiple-images-input/popup-multiple-images-input.component";
import { PopupConfirmInputComponent } from "../components/popup-confirm-input/popup-confirm-input.component";

@Component({
    selector: "app-dashboard",
    imports: [
        AdminNavElementComponent,
        AdminUnknownPageComponent,
        AdminPasswordsPageComponent,
        AdminHomepagePicturePageComponent,
        EditStaticSiteComponent,
        AdminAddAdminComponent,
        AdminRemoveAdminComponent,
        BlogCreateBlogComponent,
        BlogEditBlogComponent,
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
        PopupConfirmInputComponent,
    ],
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
    currentActiveSection = signal<string>("stats-website-analytics");
    currentActiveNavigation = signal<DashboardNavigationOptions>("main");
    currentActiveSiteEdit = signal<StaticSiteNames>("vision");
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
    mobileNavOpen = signal<boolean>(false);
    submitSiteEditButton = signal<string>("Abschliessen");

    titleInputOpen = signal(false);
    textInputOpen = signal(false);
    imageInputOpen = signal(false);
    multipleImagesInputOpen = signal(false);

    confirmInputOpen = signal(false);

    INPUT_CONTENT_DEFAULT = {
        TITLE: {
            title: "Titel eingeben:",
            description: "Bitte gib den Titel ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.",
            label: "Titel:",
            placeholder: "Titel eingeben",
        },
        SUBTITLE: {
            title: "Untertitel eingeben:",
            description: "Bitte gib den Untertitel ein, den du hinzufügen möchtest. Du kannst ihn auch nachher noch bearbeiten.",
            label: "Untertitel:",
            placeholder: "Untertitel eingeben",
        },
        GENERAL_TITLE: {
            title: "Seitentitel eingeben:",
            description: "Bitte gib den Seitentitel ein, den du für die Seite verwenden möchtest.",
            label: "Seitentitel:",
            placeholder: "Seitentitel eingeben",
        },
        GENERAL_SUBTITLE: {
            title: "Seiten Untertitel eingeben:",
            description: "Bitte gib den Seiten Untertitel ein, den du für die Seite verwenden möchtest.",
            label: "Seiten Untertitel:",
            placeholder: "Seiten Untertitel eingeben",
        },
        AUTHOR: {
            title: "Autor eingeben:",
            description: "Bitte gib deinen Vor- und Nachnamen ein, der als Autor der Seite angezeigt werden soll.",
            label: "Autor:",
            placeholder: "Autor eingeben",
        },
    };

    titleInputTitle = signal<string>("");
    titleInputDescription = signal<string>("");
    titleInputLabel = signal<string>("");
    titleInputPlaceholder = signal<string>("");

    confirmInputTitle = signal<string>("");
    confirmInputDescription = signal<string>("");
    confirmInputButtonText = signal<string>("");
    cancelInputButtonText = signal<string>("");

    titleInputContent = signal<{ title: string; placeholder: string; description: string; label: string }>({ title: "", placeholder: "", description: "", label: "" });

    textWithImageTextCache = signal<string>("");

    private editSiteService = inject(EditSiteService);
    private subpagesService = inject(SubpagesService);
    private notificationService = inject(NotificationService);

    private platformId = inject(PLATFORM_ID);

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

    ngOnInit(): void {
        for (const key in this.siteEdits) {
            const request = this.subpagesService.getStaticSite(key as StaticSiteNames);

            request.subscribe((response: GetStaticSiteApiEndpointResponse) => {
                if (response.error || response.data === null) {
                    this.notificationService.error("Fehler beim Laden der Seite", `Die Seite '${key}' konnte nicht geladen werden: ` + response.message);

                    // Set a Warning as the sites content
                    this.siteEdits[key as StaticSiteNames].set({
                        data: [],
                        metadata: {
                            title: "Fehler beim Laden der Seite",
                            subtitle: "",
                            author: "",
                            imageAlt: PUBLIC_CONFIG.FALLBACK_IMAGE_URL,
                            imageUrl: "",
                        },
                    });

                    return;
                }

                this.siteEdits[key as StaticSiteNames].set(response.data.site);
                this.siteEditImages[key as StaticSiteNames] = [];
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

    setCurrentActiveNavigation(navigation: DashboardNavigationOptions): void {
        this.currentActiveNavigation.set(navigation);
    }

    toggleMobileNav(): void {
        this.mobileNavOpen.update((value) => !value);
    }

    generateSiteEditFunction(
        type: "addTitle" | "addSubtitle" | "addParagraph" | "editGeneralTitle" | "editGeneralSubtitle" | "editAuthor" | "editTitleImage" | "addImage" | "addMultipleImages" | "addImageWithText" | "addLine" | "addCurrentTeam",
    ): Function {
        const _this = this;

        const siteEditFunction = async () => {
            if (!isPlatformBrowser(_this.platformId)) {
                console.error("Site editing functions can only be executed in the browser.");
                return;
            }

            _this.currentActionToPerform.set(type);

            // Change this to a switch in the future
            if (type === "addTitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set(_this.INPUT_CONTENT_DEFAULT.TITLE.title);
                _this.titleInputDescription.set(_this.INPUT_CONTENT_DEFAULT.TITLE.description);
                _this.titleInputLabel.set(_this.INPUT_CONTENT_DEFAULT.TITLE.label);
                _this.titleInputPlaceholder.set(_this.INPUT_CONTENT_DEFAULT.TITLE.placeholder);

            } else if (type === "addSubtitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set(_this.INPUT_CONTENT_DEFAULT.SUBTITLE.title);
                _this.titleInputDescription.set(_this.INPUT_CONTENT_DEFAULT.SUBTITLE.description);
                _this.titleInputLabel.set(_this.INPUT_CONTENT_DEFAULT.SUBTITLE.label);
                _this.titleInputPlaceholder.set(_this.INPUT_CONTENT_DEFAULT.SUBTITLE.placeholder);

            } else if (type === "addParagraph" || type === "addImageWithText") {
                _this.textInputOpen.set(true);

            } else if (type === "editGeneralTitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_TITLE.title);
                _this.titleInputDescription.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_TITLE.description);
                _this.titleInputLabel.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_TITLE.label);
                _this.titleInputPlaceholder.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_TITLE.placeholder);

            } else if (type === "editGeneralSubtitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_SUBTITLE.title);
                _this.titleInputDescription.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_SUBTITLE.description);
                _this.titleInputLabel.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_SUBTITLE.label);
                _this.titleInputPlaceholder.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_SUBTITLE.placeholder);

            } else if (type === "editAuthor") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set(_this.INPUT_CONTENT_DEFAULT.AUTHOR.title);
                _this.titleInputDescription.set(_this.INPUT_CONTENT_DEFAULT.AUTHOR.description);
                _this.titleInputLabel.set(_this.INPUT_CONTENT_DEFAULT.AUTHOR.label);
                _this.titleInputPlaceholder.set(_this.INPUT_CONTENT_DEFAULT.AUTHOR.placeholder);

            } else if (type === "editTitleImage" || type === "addImage") {
                _this.imageInputOpen.set(true);

            } else if (type === "addMultipleImages") {
                _this.multipleImagesInputOpen.set(true);

            } else if (type === "addLine") {
                const element = _this.editSiteService.addLine();

                _this.siteEdits[_this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
                    site.data.unshift(element);

                    return site;
                });

            } else if (type === "addCurrentTeam") {
                alert("Diese Funktion ist noch nicht implementiert.");
            }
        };

        return siteEditFunction;
    }

    submitSiteEdits(): void {
        this.submitSiteEditButton.set("Speichern...");

        const request = this.editSiteService.submitSite(this.currentActiveSiteEdit(), this.siteEdits[this.currentActiveSiteEdit()](), this.siteEditImages[this.currentActiveSiteEdit()]);

        request.subscribe((response: ApiEndpointResponse) => {
            this.submitSiteEditButton.set("Abschliessen");

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
                            imageAlt: PUBLIC_CONFIG.FALLBACK_IMAGE_URL,
                            imageUrl: "",
                        },
                    });

                    return;
                }

                this.siteEdits[this.currentActiveSiteEdit()].set(response.data.site);
            });
        });
    }

    handleMove(event: CdkDragDrop<string[]>, siteName: StaticSiteNames): void {
        moveItemInArray(this.siteEdits[siteName]().data, event.previousIndex, event.currentIndex);
    }

    handleEdit(index: number, siteName: StaticSiteNames): void {
        console.log(index, siteName);

        alert("Diese Funktion ist noch nicht implementiert.");
    }

    async handleDelete(index: number, siteName: StaticSiteNames): Promise<void> {
        const confirmDeletion = await confirm("Möchtest du dieses Element wirklich löschen?");

        if (!confirmDeletion) {
            return;
        }

        this.siteEdits[siteName].update((site: StaticSite): StaticSite => {
            site.data.splice(index, 1);

            return site;
        });
    }

    async closeEditSitesNavigation(): Promise<void> {
        const confirmClose = await confirm("Vergiss nicht deine Arbeit zu speichern. Möchtest du die Seiten-Bearbeitung wirklich verlassen?");

        if (!confirmClose) {
            return;
        }

        this.setCurrentActiveNavigation("main");
    }

    async closePopup(): Promise<void> {
        const yes = await confirm("Möchtest du das Popup wirklich schließen? Alle ungespeicherten Änderungen gehen verloren.");

        if (!yes) {
            return;
        }

        this.titleInputOpen.set(false);
        this.textInputOpen.set(false);
        this.imageInputOpen.set(false);
        this.multipleImagesInputOpen.set(false);
    }

    closePopupWithoutConfirmation(): void {
        this.titleInputOpen.set(false);
        this.textInputOpen.set(false);
        this.imageInputOpen.set(false);
        this.multipleImagesInputOpen.set(false);
    }

    addTitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Titel wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editSiteService.addTitle(content);

        this.siteEdits[this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
            site.data.unshift(element);

            return site;
        });
    }

    editTitle(content: string): void {}

    addSubtitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Untertitel wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editSiteService.addSubtitle(content);

        this.siteEdits[this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
            site.data.unshift(element);

            return site;
        });
    }

    editSubtitle(content: string): void {}

    editGeneralTitle(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Seitentitel wurde nicht aktualisiert, da kein Inhalt eingegeben wurde.");
            return;
        }

        this.siteEdits[this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
            site.metadata.title = content;

            return site;
        });
    }

    editGeneralSubtitle(content: string): void {
        // Allow empty subtitle

        this.siteEdits[this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
            site.metadata.subtitle = content ? content : "";

            return site;
        });
    }

    editAuthor(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Autor wurde nicht aktualisiert, da kein Inhalt eingegeben wurde.");
            return;
        }

        this.siteEdits[this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
            site.metadata.author = content;

            return site;
        });
    }

    addParagraph(content: string): void {
        if (!content) {
            this.notificationService.info("Leere Eingabe", "Der Text wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
            return;
        }

        const element = this.editSiteService.addParagraph(content);

        this.siteEdits[this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
            site.data.unshift(element);

            return site;
        });
    }

    editParagraph(content: string): void {}

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

    editImageWithTextPart1(content: string): void {}

    async addImageWithTextPart2(file: { file: File; url: string }): Promise<void> {
        // Get the content from the cache variable and add the element
        const shouldImageBePlacedLeft = await confirm("Möchtest du das Bild links oder rechts platzieren?\n(OK = Links / Abbrechen = Rechts)");

        const element = this.editSiteService.addImageWithText(file.url, file.file.name, this.textWithImageTextCache(), shouldImageBePlacedLeft ? "left" : "right");

        this.siteEdits[this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
            site.data.unshift(element);

            return site;
        });
    }

    editImageWithTextPart2(file: { file: File; url: string }): void {}

    addImage(file: { file: File; url: string }): void {
        this.siteEditImages[this.currentActiveSiteEdit()].push(file);

        const element = this.editSiteService.addImage(file.url, file.file.name);

        this.siteEdits[this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
            site.data.unshift(element);

            return site;
        });
    }

    editImage(file: { file: File; url: string }): void {}

    editGeneralImage(file: { file: File; url: string }): void {
        this.siteEditImages[this.currentActiveSiteEdit()].push(file);

        this.siteEdits[this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
            site.metadata.imageUrl = file.url;
            site.metadata.imageAlt = file.file.name;

            return site;
        });
    }

    addMultipleImages(files: { file: File; url: string }[]): void {
        if (files.length === 0) {
            this.notificationService.info("Keine Bilder ausgewählt", "Bitte wähle mindestens ein Bild aus, um diese Funktion zu nutzen.");
            return;
        }

        const images: { imageUrl: string; imageAlt: string }[] = [];

        for (const file of files) {
            this.siteEditImages[this.currentActiveSiteEdit()].push(file);

            images.push({ 
                imageUrl: file.url, 
                imageAlt: file.file.name 
            });
        }

        const element = this.editSiteService.addMultipleImages(images);

        this.siteEdits[this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
            site.data.unshift(element);

            return site;
        });
    }

    editMultipleImages(files: { file: File; url: string }[]): void {}

    handleTitleInputResult(content: string): void {
        this.titleInputOpen.set(false);

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

    handleImageInputResult(file: { file: File | null; url: string }): void {
        this.imageInputOpen.set(false);

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

        // make this subscribeable
    }
}
