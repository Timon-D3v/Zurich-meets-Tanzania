import { Component, inject, PLATFORM_ID, signal } from "@angular/core";
import { AdminNavElementComponent } from "../components/admin-nav-element/admin-nav-element.component";
import { AdminUnknownPageComponent } from "../components/admin-unknown-page/admin-unknown-page.component";
import { AdminPasswordsPageComponent } from "../components/admin-passwords-page/admin-passwords-page.component";
import { AdminHomepagePicturePageComponent } from "../components/admin-homepage-picture-page/admin-homepage-picture-page.component";
import { EditStaticBajajiComponent } from "../components/edit-static-bajaji/edit-static-bajaji.component";
import { EditStaticBeginningComponent } from "../components/edit-static-beginning/edit-static-beginning.component";
import { EditStaticBoardComponent } from "../components/edit-static-board/edit-static-board.component";
import { EditStaticCardiologyComponent } from "../components/edit-static-cardiology/edit-static-cardiology.component";
import { EditStaticFinancesComponent } from "../components/edit-static-finances/edit-static-finances.component";
import { EditStaticGeneralMeetingComponent } from "../components/edit-static-general-meeting/edit-static-general-meeting.component";
import { EditStaticGynecologyComponent } from "../components/edit-static-gynecology/edit-static-gynecology.component";
import { EditStaticHistoryComponent } from "../components/edit-static-history/edit-static-history.component";
import { EditStaticIncomeStatementComponent } from "../components/edit-static-income-statement/edit-static-income-statement.component";
import { EditStaticMbuziComponent } from "../components/edit-static-mbuzi/edit-static-mbuzi.component";
import { EditStaticMeducationComponent } from "../components/edit-static-meducation/edit-static-meducation.component";
import { EditStaticStatutesComponent } from "../components/edit-static-statutes/edit-static-statutes.component";
import { EditStaticSurgeryComponent } from "../components/edit-static-surgery/edit-static-surgery.component";
import { EditStaticTanzaniaMeetsZurichComponent } from "../components/edit-static-tanzania-meets-zurich/edit-static-tanzania-meets-zurich.component";
import { EditStaticVisionComponent } from "../components/edit-static-vision/edit-static-vision.component";
import { EditStaticZurichMeetsTanzaniaComponent } from "../components/edit-static-zurich-meets-tanzania/edit-static-zurich-meets-tanzania.component";
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
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-dashboard",
    imports: [
        AdminNavElementComponent,
        AdminUnknownPageComponent,
        AdminPasswordsPageComponent,
        AdminHomepagePicturePageComponent,
        EditStaticBajajiComponent,
        EditStaticBeginningComponent,
        EditStaticBoardComponent,
        EditStaticCardiologyComponent,
        EditStaticFinancesComponent,
        EditStaticGeneralMeetingComponent,
        EditStaticGynecologyComponent,
        EditStaticHistoryComponent,
        EditStaticIncomeStatementComponent,
        EditStaticMbuziComponent,
        EditStaticMeducationComponent,
        EditStaticStatutesComponent,
        EditStaticSurgeryComponent,
        EditStaticTanzaniaMeetsZurichComponent,
        EditStaticVisionComponent,
        EditStaticZurichMeetsTanzaniaComponent,
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
    ],
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent {
    currentActiveSection = signal<string>("stats-website-analytics");
    mobileNavOpen = signal<boolean>(false);

    private platformId = inject(PLATFORM_ID);

    generateActivateFunction(section: string): Function {
        const _this = this;

        const activationFunction = () => {
            _this.activate(section);
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

    toggleMobileNav(): void {
        this.mobileNavOpen.update((value) => !value);
    }
}
