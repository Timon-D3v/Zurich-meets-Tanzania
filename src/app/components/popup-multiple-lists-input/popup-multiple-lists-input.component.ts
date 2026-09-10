import { Component, effect, inject, input, output, signal } from "@angular/core";
import { NotificationService } from "../../services/notification.service";
import { CustomMultipleListsElement } from "../../..";
import { markdownToHtml } from "../../../shared/utils";
import { PopupTitleInputComponent } from ".././popup-title-input/popup-title-input.component";
import { PopupTextInputComponent } from ".././popup-text-input/popup-text-input.component";
import { PopupConfirmComponent } from ".././popup-confirm/popup-confirm.component";
import { Subject, take } from "rxjs";
import { CustomSubtitleComponent } from "../custom-subtitle/custom-subtitle.component";

@Component({
    selector: "app-popup-multiple-lists-input",
    imports: [PopupTitleInputComponent, PopupTextInputComponent, PopupConfirmComponent, CustomSubtitleComponent],
    templateUrl: "./popup-multiple-lists-input.component.html",
    styleUrl: "./popup-multiple-lists-input.component.scss",
})
export class PopupMultipleListsInputComponent {
    title = input<string>("Listen erstellen:");
    description = input<string>("Erstelle mehrere Listen welche nebeneinander aufgeführt werden mit den gewünschten Daten. Du kannst die Listen später jederzeit bearbeiten.");
    initialLists = input<CustomMultipleListsElement["lists"]>([
        { title: "Liste 1", items: ["Item 1", "Item 2", "Item 3"] },
        { title: "Liste 2", items: ["Item 4", "Item 5"] },
        {
            title: "Liste 3",
            items: ["Item 6", "Item 7", "Item 8", "Item 9"],
        },
    ]);
    submitButtonText = input<string>("Hinzufügen");

    resultOutput = output<CustomMultipleListsElement["lists"]>();
    closeOutput = output<void>();

    itemItoEdit = signal<{ listIndex: number; itemIndex: number } | null>(null);
    titleToEdit = signal<{ listIndex: number } | null>(null);

    confirmInputObservable = new Subject<boolean>();

    titleInputOpen = signal<boolean>(false);
    textInputOpen = signal<boolean>(false);
    confirmInputOpen = signal<boolean>(false);

    placeholder = signal<string>("");

    lists = signal<CustomMultipleListsElement["lists"]>(this.initialLists());

    private _updateLists = effect(() => {
        this.lists.set(this.initialLists());
    });

    private notificationService = inject(NotificationService);

    onSubmit(event: Event): void {
        event.preventDefault();

        console.log(this.lists());

        this.resultOutput.emit(this.lists());
    }

    close(): void {
        this.closeOutput.emit();
    }

    addList(): void {
        this.lists.update((lists) => {
            lists.push({ title: `Liste ${lists.length + 1}`, items: ["Item 1", "Item 2", "Item 3"] });

            return [...lists];
        });
    }

    removeList(): void {
        this.lists.update((lists) => {
            lists.pop();

            return [...lists];
        });
    }

    addItem(index: number): void {
        this.lists.update((lists) => {
            lists[index].items.push("-");

            return [...lists];
        });
    }

    editItem(listIndex: number, itemIndex: number): void {
        this.itemItoEdit.set({ listIndex, itemIndex });

        this.placeholder.set(this.lists()[listIndex].items[itemIndex] ?? "");

        this.textInputOpen.set(true);
    }

    editTitle(listIndex: number): void {
        this.titleToEdit.set({ listIndex });

        this.placeholder.set(this.lists()[listIndex].title);

        this.titleInputOpen.set(true);
    }

    removeItem(listIndex: number, itemIndex: number = -1): void {
        if (itemIndex === -1) {
            this.lists.update((lists) => {
                lists[listIndex].items.pop();

                return [...lists];
            });
        } else {
            this.lists.update((lists) => {
                lists[listIndex].items.splice(itemIndex, 1);

                return [...lists];
            });
        }
    }

    async awaitConfirmation(): Promise<boolean> {
        this.confirmInputOpen.set(true);

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
        this.titleInputOpen.set(false);
        this.textInputOpen.set(false);
        this.confirmInputOpen.set(false);

        this.itemItoEdit.set(null);
    }

    completeItemEdit(output: string) {
        const item = this.itemItoEdit();

        if (!item) {
            this.notificationService.error("Fehler:", "Es konnte kein Element zum Bearbeiten gefunden werden.");
            return;
        }

        this.lists.update((lists) => {
            lists[item.listIndex].items[item.itemIndex] = output;

            return [...lists];
        });

        this.closePopupWithoutConfirmation();
    }

    completeTitleEdit(output: string) {
        const title = this.titleToEdit();

        if (!title) {
            this.notificationService.error("Fehler:", "Es konnte kein Titel zum Bearbeiten gefunden werden.");
            return;
        }

        this.lists.update((lists) => {
            lists[title.listIndex].title = output;

            return [...lists];
        });

        this.closePopupWithoutConfirmation();
    }

    confirm(confirmed: boolean): void {
        this.confirmInputObservable.next(confirmed);

        this.confirmInputOpen.set(false);
    }

    markdownToHtml = markdownToHtml;
}
