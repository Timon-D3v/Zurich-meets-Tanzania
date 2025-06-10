getElm("contact-form").on("submit", async (e) => {
    e.preventDefault();

    if (getElm("contact-name").val().trim() === "") return errorNotification("Bitte geben Sie Ihren Namen ein.");
    if (getElm("contact-family-name").val().trim() === "") return errorNotification("Bitte geben Sie Ihren Nachnamen ein.");
    if (getElm("contact-email").val().trim() === "") return errorNotification("Bitte geben Sie Ihre E-Mail-Adresse ein.");
    if (getElm("contact-message").val().trim() === "") return errorNotification("Bitte geben Sie eine Nachricht ein.");

    const result = await post("/post/sendMail", {
        message: getElm("contact-message").val(),
        author_name: getElm("contact-name").val(),
        author_family_name: getElm("contact-family-name").val(),
        author_email: getElm("contact-email").val(),
    });

    if (result.status === 500) return errorNotification(result.res);

    successNotification(result.res);
    getElm("contact-submit").disabled = true;
});

const contactImg = getQuery(".bg").get(0);

root.data("data-theme") === "dark" ? (contactImg.src = "/img/stock/nightsky.jpg") : (contactImg.src = "/img/stock/sky.jpg");

root.on("change", () => {
    console.log("changed");
    root.data("data-theme") === "dark" ? (contactImg.src = "/img/stock/nightsky.jpg") : (contactImg.src = "/img/stock/sky.jpg");
});
