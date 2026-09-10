import { Component, inject, input, PLATFORM_ID, signal } from "@angular/core";
import { DelivApiFile } from "../../..";
import { isPlatformBrowser } from "@angular/common";
import { NotificationService } from "../../services/notification.service";

@Component({
    selector: "app-file-preview",
    imports: [],
    templateUrl: "./file-preview.component.html",
    styleUrl: "./file-preview.component.scss",
})
export class FilePreviewComponent {
    file = input.required<DelivApiFile>();

    contextMenuOpen = signal<boolean>(false);
    contextMenuPosition = signal<{ x: number; y: number }>({ x: 0, y: 0 });

    private platformId = inject(PLATFORM_ID);

    private notificationService = inject(NotificationService);

    rightClick(event: MouseEvent): void {
        event.preventDefault();

        this.contextMenuOpen.set(true);
        this.contextMenuPosition.set({ x: event?.clientX || 100, y: event?.clientY || 100 });

        // Close the context menu when clicking outside of it
        const closeContextMenu = (closeEvent: Event) => {
            if (typeof closeEvent?.target === "object" && closeEvent.target !== null && closeEvent.target instanceof HTMLElement && closeEvent.target.closest(`#file-preview-${this.file().uuid} > ul.context-menu`) !== null) {
                // Clicked inside the context menu, do not close it
                return;
            }
            this.contextMenuOpen.set(false);

            window.removeEventListener("click", closeContextMenu);
            window.removeEventListener("contextmenu", closeContextMenu);
            window.removeEventListener("scroll", closeContextMenu);
            window.removeEventListener("resize", closeContextMenu);
        };

        setTimeout(() => {
            window.addEventListener("click", closeContextMenu);
            window.addEventListener("contextmenu", closeContextMenu);
            window.addEventListener("scroll", closeContextMenu);
            window.addEventListener("resize", closeContextMenu);
        }, 100);
    }

    doNotCloseContextMenu(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    getFilePreviewUrl(file: DelivApiFile): string {
        if (file.mimetype.startsWith("image/")) {
            return file.url;
        } else if (file.mimetype.startsWith("video/")) {
            return "/svg/video.svg";
        } else if (file.mimetype.startsWith("audio/")) {
            return "/svg/audio.svg";
        } else if (file.mimetype === "application/pdf") {
            return "/svg/pdf.svg";
        } else {
            return "/svg/template.svg";
        }
    }

    getFilePreviewAlt(file: DelivApiFile): string {
        if (file.mimetype.startsWith("image/")) {
            return file.uuid;
        } else if (file.mimetype.startsWith("video/")) {
            return "Video";
        } else if (file.mimetype.startsWith("audio/")) {
            return "Audio";
        } else if (file.mimetype === "application/pdf") {
            return "PDF";
        } else {
            return "Unbekannter Dateityp";
        }
    }

    openFile(): void {
        if (isPlatformBrowser(this.platformId)) {
            document?.getElementById(`file-preview-${this.file().uuid}`)?.click();
        }

        this.contextMenuOpen.set(false);
    }

    renameFile(): void {
        console.log("Benenne Datei um: " + this.file().uuid);
    }

    async downloadFile(): Promise<void> {
        if (isPlatformBrowser(this.platformId)) {
            try {
                // const a = document.createElement("a");
                // a.href = this.file().url + "?download=1";
                // a.target = "_blank";
                // a.download = this.file().uuid;

                // a.click();
                this.contextMenuOpen.set(false);
                this.notificationService.info("Download gestartet", "Der Download der Datei '" + this.file().uuid + "' wurde gestartet.");

                const request = await fetch(this.file().url);

                if (!request.ok) {
                    this.notificationService.error("Download fehlgeschlagen", "Die Datei konnte nicht heruntergeladen werden. Der Server antwortete mit einem Staus von: " + request.status);
                }

                const fileBlob = await request.blob();
                const url = window.URL.createObjectURL(fileBlob);

                const a = document.createElement("a");
                a.href = url;
                a.target = "_blank";
                a.download = this.file().uuid;

                document.body.appendChild(a);
                a.click();
                a.remove();

                window.URL.revokeObjectURL(url);
            } catch (error) {
                this.notificationService.error("Download fehlgeschlagen", "Die Datei konnte nicht heruntergeladen werden. Es ist ein Fehler aufgetreten: " + (error instanceof Error ? error.message : String(error)));
            }
        }
    }

    async copyFile(): Promise<void> {
        console.log("Kopiere Datei: " + this.file().uuid);

        if (isPlatformBrowser(this.platformId)) {
            try {
                // const a = document.createElement("a");
                // a.href = this.file().url + "?download=1";
                // a.target = "_blank";
                // a.download = this.file().uuid;

                // a.click();
                this.contextMenuOpen.set(false);
                this.notificationService.info("Download gestartet", "Der Download der Datei '" + this.file().uuid + "' wurde gestartet.");

                const request = await fetch(this.file().url);

                if (!request.ok) {
                    this.notificationService.error("Download fehlgeschlagen", "Die Datei konnte nicht in die Zwischenablage kopiert werden, da die Datei nicht heruntergeladen werden konnte.");
                }

                const fileBlob = await request.blob();
                const item = new ClipboardItem({ [fileBlob.type]: fileBlob });

                navigator.clipboard
                    .write([item])
                    .then((): void => {
                        this.notificationService.success("Erfolg:", "Datei wurde in die Zwischenablage kopiert.");
                    })
                    .catch((error: Error): void => {
                        console.error(error);
                        this.notificationService.error("Fehler:", "Datei konnte nicht in die Zwischenablage kopiert werden.");
                    });
            } catch (error) {
                this.notificationService.error("Download fehlgeschlagen", "Die Datei konnte nicht in die Zwischenablage kopiert werden. Es ist ein Fehler aufgetreten: " + (error instanceof Error ? error.message : String(error)));
            }
        }
    }

    shareFile(): void {
        console.log("Teile Datei: " + this.file().uuid);

        if (isPlatformBrowser(this.platformId)) {
            try {
                this.contextMenuOpen.set(false);

                navigator.clipboard
                    .writeText(this.file().url)
                    .then((): void => {
                        this.notificationService.success("Erfolg:", "Der direkte Link zur Datei wurde in die Zwischenablage kopiert. (" + this.file().url + ")");
                    })
                    .catch((error: Error): void => {
                        console.error(error);
                        this.notificationService.error("Fehler:", "Der direkte Link zur Datei konnte nicht in die Zwischenablage kopiert werden.");
                    });
            } catch (error) {
                this.notificationService.error("Fehler", "Der direkte Link zur Datei konnte nicht in die Zwischenablage kopiert werden. Es ist ein Fehler aufgetreten: " + (error instanceof Error ? error.message : String(error)));
            }
        }
    }

    replaceFile(): void {
        console.log("Ersetze Datei: " + this.file().uuid);
    }

    deleteFile(): void {
        console.log("Lösche Datei: " + this.file().uuid);
    }
}
