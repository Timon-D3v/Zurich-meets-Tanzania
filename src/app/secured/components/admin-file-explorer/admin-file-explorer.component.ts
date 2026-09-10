import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { FileService } from "../../../services/file.service";
import { LoadingComponent } from "../../../components/loading/loading.component";
import { FilePreviewComponent } from "../../../components/file-preview/file-preview.component";
import { DelivApiFile, GetAllFileInformationApiEndpointResponse } from "../../../..";
import { isPlatformBrowser } from "@angular/common";

@Component({
    selector: "app-admin-file-explorer",
    imports: [LoadingComponent, FilePreviewComponent],
    templateUrl: "./admin-file-explorer.component.html",
    styleUrl: "./admin-file-explorer.component.scss",
})
export class AdminFileExplorerComponent implements OnInit {
    files = signal<DelivApiFile[]>([]);

    private fileService = inject(FileService);

    private platformId = inject(PLATFORM_ID);

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            console.error("Cannot fetch outside of a browser context.");
            return;
        }

        this.getAllFiles();
    }

    getAllFiles(): void {
        const request = this.fileService.getAllFiles();

        request.subscribe((response: GetAllFileInformationApiEndpointResponse) => {
            if (response.error || !response.data) {
                console.error("Die Datei Informationen konnten nicht abgerufen werden. Weitere Informationen: " + response.message);
                return;
            }

            this.files.set(response.data);
        });
    }
}
