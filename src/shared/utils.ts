export function markdownToHtml(markdown: string): string {
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
