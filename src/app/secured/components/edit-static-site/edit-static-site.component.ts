import { Component, input, output } from "@angular/core";
import { CdkDrag, CdkDragDrop, CdkDragPreview, CdkDropList } from "@angular/cdk/drag-drop";
import { StaticSite } from "../../../..";
import { HeroComponent } from "../../../components/hero/hero.component";
import { BoardComponent } from "../../../components/board/board.component";
import { CustomLineComponent } from "../../../components/custom-line/custom-line.component";
import { TeamFromIdComponent } from "../../../components/team-from-id/team-from-id.component";
import { CustomImageComponent } from "../../../components/custom-image/custom-image.component";
import { CustomTitleComponent } from "../../../components/custom-title/custom-title.component";
import { CustomTableComponent } from "../../../components/custom-table/custom-table.component";
import { CustomVideoComponent } from "../../../components/custom-video/custom-video.component";
import { CustomSourceComponent } from "../../../components/custom-source/custom-source.component";
import { CustomSubtitleComponent } from "../../../components/custom-subtitle/custom-subtitle.component";
import { CustomParagraphComponent } from "../../../components/custom-paragraph/custom-paragraph.component";
import { CustomPdfViewerComponent } from "../../../components/custom-pdf-viewer/custom-pdf-viewer.component";
import { CustomImageCarouselComponent } from "../../../components/custom-image-carousel/custom-image-carousel.component";
import { CustomMultipleListsComponent } from "../../../components/custom-multiple-lists/custom-multiple-lists.component";
import { CustomImageWithTextComponent } from "../../../components/custom-image-with-text/custom-image-with-text.component";
import { CustomMultipleButtonsComponent } from "../../../components/custom-multiple-buttons/custom-multiple-buttons.component";

@Component({
    selector: "app-edit-static-site",
    imports: [
        CdkDragPreview,
        CdkDropList,
        CdkDrag,
        HeroComponent,
        TeamFromIdComponent,
        CustomLineComponent,
        CustomImageWithTextComponent,
        CustomImageCarouselComponent,
        CustomImageComponent,
        CustomParagraphComponent,
        CustomSubtitleComponent,
        CustomTitleComponent,
        CustomMultipleListsComponent,
        CustomVideoComponent,
        CustomTableComponent,
        CustomSourceComponent,
        CustomPdfViewerComponent,
        CustomMultipleButtonsComponent,
        BoardComponent,
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
