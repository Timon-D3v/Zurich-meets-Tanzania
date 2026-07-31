import { Component, effect, inject, input, output, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { NotificationService } from "../../services/notification.service";
import { CustomTableElement } from "../../..";
import { PUBLIC_CONFIG } from "../../../publicConfig";
import { markdownToHtml } from "../../../shared/utils";
import { PopupTitleInputComponent } from ".././popup-title-input/popup-title-input.component";
import { PopupTextInputComponent } from ".././popup-text-input/popup-text-input.component";
import { PopupImageInputComponent } from ".././popup-image-input/popup-image-input.component";
import { PopupSelectionInputComponent } from ".././popup-selection-input/popup-selection-input.component";
import { PopupConfirmComponent } from ".././popup-confirm/popup-confirm.component";
import { Subject, take } from "rxjs";
import { utils as xlsxUtils, read as xlsxRead } from "xlsx";

@Component({
    selector: "app-popup-table-input",
    imports: [PopupTitleInputComponent, PopupTextInputComponent, PopupImageInputComponent, PopupSelectionInputComponent, PopupConfirmComponent, ReactiveFormsModule],
    templateUrl: "./popup-table-input.component.html",
    styleUrl: "./popup-table-input.component.scss",
})
export class PopupTableInputComponent {
    private noSource = "Keine Quelle";
    title = input<string>("Tabelle erstellen:");
    description = input<string>("Erstelle eine Tabelle mit den gewünschten Daten. Es ist in jeder Zelle möglich, Text oder ein Bild einzufügen. Du kannst die Tabelle später jederzeit bearbeiten.");
    initialHeaders = input<CustomTableElement["headers"]>([
        { type: "subtitle", content: "Deine Überschrift 1" },
        { type: "subtitle", content: "Deine Überschrift 2" },
    ]);
    initialRows = input<CustomTableElement["rows"]>([
        [
            { type: "paragraph", content: "Dein Text 1" },
            { type: "paragraph", content: "Dein Text 2" },
        ],
    ]);
    sourceNameLabel = input<string>("Quellen Name (optional):");
    initialSourceName = input<string>(this.noSource);
    sourceUrlLabel = input<string>("Quellen URL (optional):");
    initialSourceUrl = input<string>(this.noSource);
    submitButtonText = input<string>("Hinzufügen");

    resultOutput = output<CustomTableElement>();
    filesOutput = output<{ file: File | null; url: string }>();
    closeOutput = output<void>();

    elementToEdit = signal<{ type: "header"; index: number } | { type: "cell"; rowIndex: number; cellIndex: number } | null>(null);

    confirmInputObservable = new Subject<boolean>();
    selectionInputObservable = new Subject<"Text" | "Bild">();

    inputs = {
        titleOpen: signal<boolean>(false),
        textOpen: signal<boolean>(false),
        imageOpen: signal<boolean>(false),
        selectionOpen: signal<boolean>(false),
        confirmOpen: signal<boolean>(false),
        alertOpen: signal<boolean>(false),
    };

    placeholders = {
        title: signal<string>(""),
        text: signal<string>(""),
        imageUrl: signal<string>(PUBLIC_CONFIG.FALLBACK_IMAGE_URL),
    };

    sourceForm = new FormGroup({
        contentControl: new FormControl(""),
        urlControl: new FormControl(""),
    });

    private _updatePlaceholderEffect = effect(() => {
        const editInformation = this.elementToEdit();

        if (!editInformation) {
            return;
        }

        if (editInformation.type === "header") {
            const header = this.table().headers[editInformation.index];

            if (header.type === "subtitle") {
                this.placeholders.title.set(header.content);
                this.placeholders.text.set("");
                this.placeholders.imageUrl.set(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);
            } else if (header.type === "image") {
                this.placeholders.imageUrl.set(header.imageUrl);
                this.placeholders.title.set("");
                this.placeholders.text.set("");
            }
        } else if (editInformation.type === "cell") {
            const cell = this.table().rows[editInformation.rowIndex][editInformation.cellIndex];

            if (cell.type === "paragraph") {
                this.placeholders.text.set(cell.content);
                this.placeholders.title.set("");
                this.placeholders.imageUrl.set(PUBLIC_CONFIG.FALLBACK_IMAGE_URL);
            } else if (cell.type === "image") {
                this.placeholders.imageUrl.set(cell.imageUrl);
                this.placeholders.title.set("");
                this.placeholders.text.set("");
            }
        }
    });

    table = signal<CustomTableElement>({
        type: "table",
        headers: this.initialHeaders(),
        rows: this.initialRows(),
        source: {
            content: this.initialSourceName() === this.noSource ? "" : this.initialSourceName(),
            url: this.initialSourceUrl() === this.noSource ? "" : this.initialSourceUrl(),
        },
    });

    private notificationService = inject(NotificationService);

    private _updateFormControl = effect(() => {
        this.sourceForm.patchValue({
            contentControl: this.initialSourceName() === this.noSource ? "" : this.initialSourceName(),
            urlControl: this.initialSourceUrl() === this.noSource ? "" : this.initialSourceUrl(),
        });

        this.table.set({
            type: "table",
            headers: this.initialHeaders(),
            rows: this.initialRows(),
            source: {
                content: this.initialSourceName() === this.noSource ? "" : (this.sourceForm.value.contentControl ?? ""),
                url: this.initialSourceUrl() === this.noSource ? "" : (this.sourceForm.value.urlControl ?? ""),
            },
        });
    });

    onSubmit(event: Event): void {
        event.preventDefault();

        this.resultOutput.emit(this.table());
    }

    close(): void {
        this.closeOutput.emit();
    }

    async edit(rowIndex: number, cellIndex: number): Promise<void> {
        const type = await this.awaitSelection();

        if (type === "Bild") {
            this.elementToEdit.set({ type: "cell", rowIndex, cellIndex });
            this.inputs.imageOpen.set(true);
        } else if (type === "Text") {
            this.elementToEdit.set({ type: "cell", rowIndex, cellIndex });
            this.inputs.textOpen.set(true);
        }
    }

    reset(rowIndex: number, cellIndex: number): void {
        this.table.update((table) => {
            table.rows[rowIndex].splice(cellIndex, 1, { type: "paragraph", content: "-" });

            return {
                ...table,
            };
        });
    }

    addColumn(): void {
        this.table.update((table) => {
            table.headers.push({ type: "subtitle", content: "-" });

            for (const row of table.rows) {
                row.push({ type: "paragraph", content: "-" });
            }

            return {
                ...table,
            };
        });
    }

    addRow(): void {
        this.table.update((table) => {
            table.rows.push([]);

            for (let i = 0; i < table.headers.length; i++) {
                table.rows[table.rows.length - 1].push({ type: "paragraph", content: "-" });
            }

            return {
                ...table,
            };
        });
    }

    removeColumn(): void {
        this.table.update((table) => {
            table.headers.pop();

            for (const row of table.rows) {
                row.pop();
            }

            return {
                ...table,
            };
        });
    }

    removeRow(): void {
        this.table.update((table) => {
            table.rows.pop();

            return {
                ...table,
            };
        });
    }

    async readFile(event: Event): Promise<void> {
        if (!(event.target instanceof HTMLInputElement)) {
            return;
        }

        const inputElement = event.target;

        if (!inputElement.files || inputElement.files.length === 0) {
            this.notificationService.info("Keine Datei ausgewählt", "Bitte wähle eine Datei aus, um fortzufahren.");
            return;
        }

        const file = inputElement.files[0];

        if (!file) {
            this.notificationService.info("Keine Datei ausgewählt", "Bitte wähle eine Datei aus, um fortzufahren.");
            return;
        }

        const buffer = await file.arrayBuffer();

        const workbook = xlsxRead(buffer);

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const data = xlsxUtils.sheet_to_json(sheet, {
            header: 1,
            blankrows: true,
            defval: "",
            rawNumbers: true,
        });

        if (data.length === 0) {
            this.notificationService.error("Leere Datei", "Die ausgewählte Datei enthält keine Daten oder die Daten können nicht gelesen werden.");
            return;
        }

        if (data.length < 2) {
            this.notificationService.warn("Nicht genügend Daten", "Die ausgewählte Datei muss mindestens eine Zeile für die Überschriften und eine Zeile für die Daten enthalten.");
            return;
        }

        const rawHeaders = data[0] as any[];

        const rawRows = data.slice(1) as any[][];

        const headers: CustomTableElement["headers"] = rawHeaders.map((header) => {
            if (typeof header === "string") {
                return { type: "subtitle", content: header };
            } else if (typeof header === "number") {
                return { type: "subtitle", content: header.toString() };
            } else if (typeof header === "undefined") {
                return { type: "subtitle", content: "" };
            } else {
                return { type: "subtitle", content: "<Fehler>" };
            }
        });

        const rows: CustomTableElement["rows"] = rawRows.map((row) => {
            return row.map((cell) => {
                if (typeof cell === "string") {
                    return { type: "paragraph", content: cell };
                } else if (typeof cell === "number") {
                    return { type: "paragraph", content: cell.toString() };
                } else if (typeof cell === "undefined") {
                    return { type: "paragraph", content: "" };
                } else {
                    return { type: "paragraph", content: "<Fehler>" };
                }
            });
        });

        this.table.update((table) => {
            return {
                ...table,
                rows: rows,
                headers: headers,
            };
        });
    }

    async editHeader(headerIndex: number): Promise<void> {
        const type = await this.awaitSelection();

        if (type === "Bild") {
            this.elementToEdit.set({ type: "header", index: headerIndex });
            this.inputs.imageOpen.set(true);
        } else if (type === "Text") {
            this.elementToEdit.set({ type: "header", index: headerIndex });
            this.inputs.titleOpen.set(true);
        }
    }

    resetHeader(headerIndex: number): void {
        this.table.update((table) => {
            table.headers.splice(headerIndex, 1, { type: "subtitle", content: "-" });

            return {
                ...table,
            };
        });
    }

    streamSourceName(event: Event): void {
        if (!(event.target instanceof HTMLInputElement)) {
            return;
        }

        const inputElement = event.target;

        this.table.update((table) => {
            table.source!.content = inputElement.value;

            return {
                ...table,
            };
        });
    }

    streamSourceUrl(event: Event): void {
        if (!(event.target instanceof HTMLInputElement)) {
            return;
        }

        const inputElement = event.target;

        this.table.update((table) => {
            table.source!.url = inputElement.value;

            return {
                ...table,
            };
        });
    }

    async awaitSelection(): Promise<"Text" | "Bild"> {
        this.inputs.selectionOpen.set(true);

        return new Promise<"Text" | "Bild">((resolve) => {
            this.selectionInputObservable.pipe(take(1)).subscribe((result) => {
                resolve(result || "Text");
            });
        });
    }

    async awaitConfirmation(): Promise<boolean> {
        this.inputs.confirmOpen.set(true);

        return new Promise<boolean>((resolve) => {
            this.confirmInputObservable.pipe(take(1)).subscribe((result) => {
                resolve(result || false);
            });
        });
    }

    async closePopup(): Promise<void> {
        const yes = await this.awaitConfirmation();

        if (!yes) {
            return;
        }

        this.closePopupWithoutConfirmation();
    }

    closePopupWithoutConfirmation(): void {
        this.inputs.titleOpen.set(false);
        this.inputs.textOpen.set(false);
        this.inputs.imageOpen.set(false);
        this.inputs.selectionOpen.set(false);
        this.inputs.confirmOpen.set(false);
        this.inputs.alertOpen.set(false);

        this.elementToEdit.set(null);
    }

    results = {
        editText: (output: string) => {
            const element = this.elementToEdit();

            if (!element) {
                this.notificationService.error("Fehler: ", "Es konnte kein Element zum Bearbeiten gefunden werden.");
                return;
            }

            if (element.type === "header") {
                this.table.update((table) => {
                    table.headers[element.index] = { type: "subtitle", content: output };

                    return {
                        ...table,
                    };
                });
            } else if (element.type === "cell") {
                this.table.update((table) => {
                    table.rows[element.rowIndex][element.cellIndex] = { type: "paragraph", content: output };

                    return {
                        ...table,
                    };
                });
            }

            this.closePopupWithoutConfirmation();
        },
        editImage: (output: { file: File | null; url: string }) => {
            const element = this.elementToEdit();

            this.filesOutput.emit(output);

            if (!element) {
                this.notificationService.error("Fehler: ", "Es konnte kein Element zum Bearbeiten gefunden werden.");
                return;
            }

            if (!output.file) {
                this.notificationService.info("Kein Bild ausgewählt", "Bitte wähle ein Bild aus, um diese Funktion zu nutzen.");

                return;
            }

            if (element.type === "header") {
                this.table.update((table) => {
                    table.headers[element.index] = { type: "image", imageAlt: output.file?.name || "", imageUrl: output.url };

                    return {
                        ...table,
                    };
                });
            } else if (element.type === "cell") {
                this.table.update((table) => {
                    table.rows[element.rowIndex][element.cellIndex] = { type: "image", imageAlt: output.file?.name || "", imageUrl: output.url };

                    return {
                        ...table,
                    };
                });
            }

            this.closePopupWithoutConfirmation();
        },
        confirm: (confirmed: boolean) => {
            this.confirmInputObservable.next(confirmed);

            this.inputs.confirmOpen.set(false);
        },
        selection: (output: string) => {
            this.selectionInputObservable.next(output as "Text" | "Bild");

            this.inputs.selectionOpen.set(false);
        },
    };

    markdownToHtml = markdownToHtml;
}
