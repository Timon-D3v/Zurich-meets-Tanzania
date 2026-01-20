import { Component, input, output } from "@angular/core";
import { CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList, moveItemInArray } from "@angular/cdk/drag-drop";
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
    imports: [
        CdkDragPreview,
        CurrentTeamComponent,
        HeroComponent,
        CustomTitleComponent,
        CustomSubtitleComponent,
        CustomParagraphComponent,
        CustomImageComponent,
        CustomImageCarouselComponent,
        CustomImageWithTextComponent,
        CustomLineComponent,
        CdkDropList,
        CdkDrag,
    ],
    templateUrl: "./edit-static-site.component.html",
    styleUrl: "./edit-static-site.component.scss",
})
export class EditStaticSiteComponent {
    readonly site = input.required<StaticSite>();

    moveOutput = output<CdkDragDrop<string[]>>();
    editOutput = output<number>();
    deleteOutput = output<number>();

    moveElement(event: CdkDragDrop<string[]>): void {
        this.moveOutput.emit(event);
    }

    editElement(index: number): void {
        this.editOutput.emit(index);
    }

    deleteElement(index: number): void {
        this.deleteOutput.emit(index);
    }
}
