import { Component, effect, input, output, signal } from "@angular/core";

@Component({
    selector: "app-popup-markdown-preview",
    imports: [],
    templateUrl: "./popup-markdown-preview.component.html",
    styleUrl: "./popup-markdown-preview.component.scss",
})
export class PopupMarkdownPreviewComponent {
    content = input<string>("Etwas ist passiert, das deine Aufmerksamkeit erfordert.");

    closeOutput = output<void>();

    htmlContent = signal<string>("");

    private _updateContent = effect(() => {
        this.htmlContent.set(this.markdownToHtml(this.content()));
    });

    private markdownToHtml(markdown: string): string {
        // Simple markdown to HTML conversion
        let html = markdown;

        // Convert line breaks to <br> tags
        html = html.replace(/\n/gm, "<br>");

        // Convert ***bold*** to <strong>bold</strong>
        html = html.replace(/\*\*\*(.*?)\*\*\*/gm, "<strong>$1</strong>");

        // Convert ___italic___ to <em>italic</em>
        html = html.replace(/\_\_\_(.*?)\_\_\_/gm, "<em>$1</em>");

        // Convert +++underline+++ to <u>underline</u>
        html = html.replace(/\+\+\+(.*?)\+\+\+/gm, "<u>$1</u>");

        // Convert ![text](url) to <a href="url">text</a>
        html = html.replace(/\!\[(.*?)\]\((.*?)\)/gm, "<a href='$2' target='_blank'>$1</a>");

        return html;
    }

    onSubmit(event: Event): void {
        event.preventDefault();

        this.close();
    }

    close(): void {
        this.closeOutput.emit();
    }
}
