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
    currentActionToPerform = signal<"addTitle" | "addSubtitle" | "addParagraph" | "addImage" | "addMultipleImages" | "addImageWithText" | "addLine" | "addCurrentTeam" | "editTitle" | "editSubtitle" | "editParagraph" | "editGeneralTitle" | "editGeneralSubtitle" | "editAuthor" | "editTitleImage" | "editImage" | "editMultipleImages" | "editImageWithText"
>(
        "addTitle",
    );
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
        const visionRequest = this.subpagesService.getStaticSite("vision");
        const boardRequest = this.subpagesService.getStaticSite("board");
        const beginningRequest = this.subpagesService.getStaticSite("beginning");
        const financesRequest = this.subpagesService.getStaticSite("finances");
        const incomeStatementRequest = this.subpagesService.getStaticSite("income-statement");
        const generalMeetingRequest = this.subpagesService.getStaticSite("general-meeting");
        const statutesRequest = this.subpagesService.getStaticSite("statutes");
        const zurichMeetsTanzaniaRequest = this.subpagesService.getStaticSite("zurich-meets-tanzania");
        const tanzaniaMeetsZurichRequest = this.subpagesService.getStaticSite("tanzania-meets-zurich");
        const mbuziRequest = this.subpagesService.getStaticSite("mbuzi");
        const gynecologyRequest = this.subpagesService.getStaticSite("gynecology");
        const meducationRequest = this.subpagesService.getStaticSite("meducation");
        const bajajiRequest = this.subpagesService.getStaticSite("bajaji");
        const cardiologyRequest = this.subpagesService.getStaticSite("cardiology");
        const surgeryRequest = this.subpagesService.getStaticSite("surgery");
        const historyRequest = this.subpagesService.getStaticSite("history");

        const generateSubscriptionHandler = (siteName: StaticSiteNames) => {
            return (response: GetStaticSiteApiEndpointResponse) => {
                if (response.error || response.data === null) {
                    this.notificationService.error("Fehler beim Laden der Seite", `Die Seite '${siteName}' konnte nicht geladen werden: ` + response.message);

                    // Set a Warning as the sites content
                    this.siteEdits[siteName].set({
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

                this.siteEdits[siteName].set(response.data.site);
                this.siteEditImages[siteName] = [];
            };
        };

        visionRequest.subscribe(generateSubscriptionHandler("vision"));
        boardRequest.subscribe(generateSubscriptionHandler("board"));
        beginningRequest.subscribe(generateSubscriptionHandler("beginning"));
        financesRequest.subscribe(generateSubscriptionHandler("finances"));
        incomeStatementRequest.subscribe(generateSubscriptionHandler("income-statement"));
        generalMeetingRequest.subscribe(generateSubscriptionHandler("general-meeting"));
        statutesRequest.subscribe(generateSubscriptionHandler("statutes"));
        zurichMeetsTanzaniaRequest.subscribe(generateSubscriptionHandler("zurich-meets-tanzania"));
        tanzaniaMeetsZurichRequest.subscribe(generateSubscriptionHandler("tanzania-meets-zurich"));
        mbuziRequest.subscribe(generateSubscriptionHandler("mbuzi"));
        gynecologyRequest.subscribe(generateSubscriptionHandler("gynecology"));
        meducationRequest.subscribe(generateSubscriptionHandler("meducation"));
        bajajiRequest.subscribe(generateSubscriptionHandler("bajaji"));
        cardiologyRequest.subscribe(generateSubscriptionHandler("cardiology"));
        surgeryRequest.subscribe(generateSubscriptionHandler("surgery"));
        historyRequest.subscribe(generateSubscriptionHandler("history"));
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

                return;
            } else if (type === "addSubtitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set(_this.INPUT_CONTENT_DEFAULT.SUBTITLE.title);
                _this.titleInputDescription.set(_this.INPUT_CONTENT_DEFAULT.SUBTITLE.description);
                _this.titleInputLabel.set(_this.INPUT_CONTENT_DEFAULT.SUBTITLE.label);
                _this.titleInputPlaceholder.set(_this.INPUT_CONTENT_DEFAULT.SUBTITLE.placeholder);

                return;
            } else if (type === "addParagraph") {
                _this.textInputOpen.set(true);

                return;
            } else if (type === "editGeneralTitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_TITLE.title);
                _this.titleInputDescription.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_TITLE.description);
                _this.titleInputLabel.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_TITLE.label);
                _this.titleInputPlaceholder.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_TITLE.placeholder);

                return;
            } else if (type === "editGeneralSubtitle") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_SUBTITLE.title);
                _this.titleInputDescription.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_SUBTITLE.description);
                _this.titleInputLabel.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_SUBTITLE.label);
                _this.titleInputPlaceholder.set(_this.INPUT_CONTENT_DEFAULT.GENERAL_SUBTITLE.placeholder);

                return;
            } else if (type === "editAuthor") {
                _this.titleInputOpen.set(true);

                _this.titleInputTitle.set(_this.INPUT_CONTENT_DEFAULT.AUTHOR.title);
                _this.titleInputDescription.set(_this.INPUT_CONTENT_DEFAULT.AUTHOR.description);
                _this.titleInputLabel.set(_this.INPUT_CONTENT_DEFAULT.AUTHOR.label);
                _this.titleInputPlaceholder.set(_this.INPUT_CONTENT_DEFAULT.AUTHOR.placeholder);

                return;
            } else if (type === "editTitleImage") {
                const input = document.createElement("input");

                input.type = "file";
                input.accept = "image/*";

                input.onchange = () => {
                    if (input.files && input.files[0]) {
                        const file = input.files[0];

                        const imageUrl = _this.getStaticImageUrl(file);

                        _this.siteEdits[_this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
                            site.metadata.imageUrl = imageUrl;
                            site.metadata.imageAlt = file.name;

                            return site;
                        });
                    } else {
                        _this.notificationService.info("Kein Bild ausgewählt", "Bitte wähle ein Bild aus, um diese Funktion zu nutzen.");
                    }
                };

                input.click();

                return;
            } else if (type === "addImage") {
                const input = document.createElement("input");

                input.type = "file";
                input.accept = "image/*";

                input.onchange = () => {
                    if (input.files && input.files[0]) {
                        const file = input.files[0];

                        const imageUrl = _this.getStaticImageUrl(file);
                        const element = _this.editSiteService.addImage(imageUrl, file.name);

                        _this.siteEdits[_this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
                            site.data.unshift(element);

                            return site;
                        });
                    } else {
                        _this.notificationService.info("Kein Bild ausgewählt", "Bitte wähle ein Bild aus, um diese Funktion zu nutzen.");
                    }
                };

                input.click();

                return;
            } else if (type === "addMultipleImages") {
                const input = document.createElement("input");

                input.type = "file";
                input.accept = "image/*";
                input.multiple = true;

                input.onchange = () => {
                    if (input.files && input.files.length > 1) {
                        const files = Array.from(input.files);

                        const images: { imageUrl: string; imageAlt: string }[] = [];

                        for (const file of files) {
                            const imageUrl = _this.getStaticImageUrl(file);
                            images.push({ imageUrl, imageAlt: file.name });
                        }

                        const element = _this.editSiteService.addMultipleImages(images);

                        _this.siteEdits[_this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
                            site.data.unshift(element);

                            return site;
                        });
                    } else {
                        _this.notificationService.info("Mehrere Bilder auswählen", "Bitte wähle mehrere Bilder aus, um diese Funktion zu nutzen.");
                    }
                };

                input.click();

                return;
            } else if (type === "addImageWithText") {
                const input = document.createElement("input");

                input.type = "file";
                input.accept = "image/*";

                input.onchange = async () => {
                    if (input.files && input.files[0]) {
                        const file = input.files[0];

                        const imageUrl = _this.getStaticImageUrl(file);

                        const content = await prompt("Text zum Bild eingeben:");

                        if (!content) {
                            _this.notificationService.info("Leere Eingabe", "Der Text zum Bild wurde nicht hinzugefügt, da kein Inhalt eingegeben wurde.");
                            return;
                        }

                        const shouldImageBePlacedLeft = await confirm("Möchtest du das Bild links oder rechts platzieren?\n(OK = Links / Abbrechen = Rechts)");

                        const element = _this.editSiteService.addImageWithText(imageUrl, file.name, content, shouldImageBePlacedLeft ? "left" : "right");

                        _this.siteEdits[_this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
                            site.data.unshift(element);

                            return site;
                        });
                    } else {
                        _this.notificationService.info("Kein Bild ausgewählt", "Bitte wähle ein Bild aus, um diese Funktion zu nutzen.");
                    }
                };

                input.click();

                return;
            } else if (type === "addLine") {
                const element = _this.editSiteService.addLine();

                _this.siteEdits[_this.currentActiveSiteEdit()].update((site: StaticSite): StaticSite => {
                    site.data.unshift(element);

                    return site;
                });

                return;
            } else if (type === "addCurrentTeam") {
                alert("Diese Funktion ist noch nicht implementiert.");
                return;
            }
        };

        return siteEditFunction;
    }

    getStaticImageUrl(file: File): string {
        const url = URL.createObjectURL(file);

        this.siteEditImages[this.currentActiveSiteEdit()].push({ url, file });

        return url;
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

    editTitle(content: string): void {
    }

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

    editSubtitle(content: string): void {
    }

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

    addImageWithTextPart1(content: string): void {} // add the content to a cache variable and open the image input popup

    editImageWithTextPart1(content: string): void {}

    addImageWithTextPart2(file: { file: File, url: string}): void {} // get the content from the cache variable and add the element

    editImageWithTextPart2(file: { file: File, url: string}): void {}

    addImage(file: { file: File, url: string}): void {}

    editImage(file: { file: File, url: string}): void {}

    addMultipleImages(files: { file: File, url: string }[]): void {}

    editMultipleImages(files: { file: File, url: string }[]): void {}

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

    handleImageInputResult(file: { file: File | null, url: string}): void {
        this.imageInputOpen.set(false);

        if (file.file === null) {
            this.notificationService.info("Kein Bild ausgewählt", "Bitte wähle ein Bild aus, um diese Funktion zu nutzen.");

            return;
        }

        switch (this.currentActionToPerform()) {
            case "addParagraph":
                this.addImage(file as { file: File, url: string});
                break;
            case "editParagraph":
                this.editImage(file as { file: File, url: string});
                break;
            case "addImageWithText":
                this.addImageWithTextPart2(file as { file: File, url: string});
                break;
            case "editImageWithText":
                this.editImageWithTextPart2(file as { file: File, url: string});
                break;
            default:
                this.notificationService.error("Unbekannte Aktion", "Diese Aktion kann nicht mit dem aktuellen Popup verarbeitet werden.");
                break;
        }
    }

    handleMultipleImagesInputResult(files: { file: File, url: string }[]): void {
        this.multipleImagesInputOpen.set(false);

        switch (this.currentActionToPerform()) {
            case "addParagraph":
                this.addMultipleImages(files);
                break;
            case "editParagraph":
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
