const donateName = getElm("donate-name");
const donateFamilyName = getElm("donate-family-name");
const donateEmail = getElm("donate-email");
const donateUsageType = getElm("donate-usage-type");
const donateSubmit = getElm("donate-submit");
const membershipSubmit = getElm("membership-submit");

membershipSubmit.click(async (e) => {
    e.preventDefault();

    const { link } = await post("/post/getPaymentLink", {
        type: "membership",
        amount: -1,
    });

    if (typeof link === "string") return (window.location.href = link);

    return errorNotification("Etwas hat nicht geklappt...");
});

donateSubmit.click(async (e) => {
    e.preventDefault();

    if (donateName.val().trim() === "") return errorNotification("Bitte geben Sie Ihren Namen ein.");
    if (donateFamilyName.val().trim() === "") return errorNotification("Bitte geben Sie Ihren Nachnamen ein.");
    if (donateEmail.val().trim() === "") return errorNotification("Bitte geben Sie Ihre E-Mail-Adresse ein.");
    if (donateUsageType.val().trim() === "") return errorNotification("Bitte geben Sie den Verwendungszweck ein.");

    const { error, message } = await post("/post/donateForm", {
        name: donateName.val().trim(),
        familyName: donateFamilyName.val().trim(),
        email: donateEmail.val().trim(),
        usageType: donateUsageType.val().trim(),
    });

    if (error) return errorNotification(message);

    donateSubmit.disabled = true;
    successNotification(message);
});

on(window, "DOMContentLoaded", async () => {
    const prefilledDonateName = document.getElementById("donate-prefilled-name");
    const prefilledDonateFamilyName = document.getElementById("donate-prefilled-family-name");
    const prefilledDonateEmail = document.getElementById("donate-prefilled-email");

    if (prefilledDonateName === null || prefilledDonateFamilyName === null || prefilledDonateEmail === null) return;

    donateName.val(prefilledDonateName.innerText);
    donateFamilyName.val(prefilledDonateFamilyName.innerText);
    donateEmail.val(prefilledDonateEmail.innerText);
});
