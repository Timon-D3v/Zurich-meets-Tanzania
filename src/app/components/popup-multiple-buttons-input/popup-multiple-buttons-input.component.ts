import { Component, effect, inject, input, output, signal } from "@angular/core";
import { NotificationService } from "../../services/notification.service";
import { CustomMultipleButtonsElement } from "../../..";
import { PopupTitleInputComponent } from ".././popup-title-input/popup-title-input.component";
import { PopupConfirmComponent } from ".././popup-confirm/popup-confirm.component";
import { Subject, take } from "rxjs";

@Component({
    selector: "app-popup-multiple-buttons-input",
    imports: [PopupTitleInputComponent, PopupConfirmComponent],
    templateUrl: "./popup-multiple-buttons-input.component.html",
    styleUrl: "./popup-multiple-buttons-input.component.scss",
})
export class PopupMultipleButtonsInputComponent {
    title = input<string>("Buttons erstellen:");
    description = input<string>("Erstelle mehrere Buttons welche nebeneinander aufgeführt werden und als Link agieren. Du kannst die Buttons später jederzeit bearbeiten.");
    initialButtons = input<CustomMultipleButtonsElement["buttons"]>([
        {
            content: "Button 1",
            url: "https://example.com/button1",
            secondary: false,
        },
        {
            content: "Button 2",
            url: "https://example.com/button2",
            secondary: true,
        },
        {
            content: "Button 3",
            url: "https://example.com/button3",
            secondary: false,
        },
    ]);
    submitButtonText = input<string>("Hinzufügen");

    resultOutput = output<CustomMultipleButtonsElement["buttons"]>();
    closeOutput = output<void>();

    buttonToEdit = signal<number | null>(null);

    confirmInputObservable = new Subject<boolean>();

    confirmInputOpen = signal<boolean>(false);
    inputOpen = signal<boolean>(false);

    inputStage = signal<"content" | "url">("content");

    placeholder = signal<string>("");

    buttons = signal<CustomMultipleButtonsElement["buttons"]>(this.initialButtons());

    private _updateButtons = effect(() => {
        this.buttons.set(this.initialButtons());
    });

    private notificationService = inject(NotificationService);

    onSubmit(event: Event): void {
        event.preventDefault();

        console.log(this.buttons());

        this.resultOutput.emit(this.buttons());
    }

    close(): void {
        this.closeOutput.emit();
    }

    addButton(): void {
        this.buttons.update((buttons) => {
            buttons.push({ content: `Button ${buttons.length + 1}`, url: `https://example.com/button${buttons.length + 1}`, secondary: false });

            return [...buttons];
        });
    }

    removeButton(): void {
        this.buttons.update((buttons) => {
            buttons.pop();

            return [...buttons];
        });
    }

    edit(event: Event, index: number): void {
        event.preventDefault();

        this.buttonToEdit.set(index);

        this.placeholder.set(this.buttons()[index].content);

        this.inputStage.set("content");

        this.inputOpen.set(true);
    }

    toggle(event: Event, index: number): void {
        event.preventDefault();

        this.buttons.update((buttons) => {
            buttons[index].secondary = !buttons[index].secondary;

            return [...buttons];
        });
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
        this.inputOpen.set(false);
        this.confirmInputOpen.set(false);

        this.buttonToEdit.set(null);
    }

    submit(output: string) {
        const index = this.buttonToEdit();

        if (!index) {
            this.notificationService.error("Fehler:", "Es konnte kein Button zum Bearbeiten gefunden werden.");
            return;
        }

        if (this.inputStage() === "content") {
            this.buttons.update((buttons) => {
                buttons[index].content = output;

                return [...buttons];
            });
            this.placeholder.set(this.buttons()[index].url);

            this.inputStage.set("url");
        } else if (this.inputStage() === "url") {
            this.buttons.update((buttons) => {
                buttons[index].url = output;

                return [...buttons];
            });
            this.closePopupWithoutConfirmation();
        }
    }

    confirm(confirmed: boolean): void {
        this.confirmInputObservable.next(confirmed);

        this.confirmInputOpen.set(false);
    }
}
