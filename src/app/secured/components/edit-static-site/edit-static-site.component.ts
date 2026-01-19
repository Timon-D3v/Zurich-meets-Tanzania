import { Component, input } from "@angular/core";
import { StaticSite } from "../../../..";
import { CurrentTeamComponent } from "../../../current-team/current-team.component";
import { HeroComponent } from "../../../components/hero/hero.component";
import { CustomTitleComponent } from "../../../components/custom-title/custom-title.component";
import { CustomSubtitleComponent } from "../../../components/custom-subtitle/custom-subtitle.component";
import { CustomParagraphComponent } from "../../../components/custom-paragraph/custom-paragraph.component";
import { CustomImageComponent } from "../../../components/custom-image/custom-image.component";
import { CustomImageCarouselComponent } from "../../../components/custom-image-carousel/custom-image-carousel.component";
import { CustomImageWithTextComponent } from "../../../components/custom-image-with-text/custom-image-with-text.component";
import { CustomLineComponent } from "../../../components/custom-line/custom-line.component";

@Component({
    selector: "app-edit-static-site",
    imports: [CurrentTeamComponent, HeroComponent, CustomTitleComponent, CustomSubtitleComponent, CustomParagraphComponent, CustomImageComponent, CustomImageCarouselComponent, CustomImageWithTextComponent, CustomLineComponent],
    templateUrl: "./edit-static-site.component.html",
    styleUrl: "./edit-static-site.component.scss",
})
export class EditStaticSiteComponent {
    readonly site = input.required<StaticSite>();
}
