import { Request, Response, Router } from "express";
import { AddToNewsletterListApiEndpointResponse, NewsletterSignUpRequest } from "..";
import { getAllNewsletterEmails } from "../shared/newsletter.database";
import { PUBLIC_CONFIG } from "../publicConfig";
import { randomBytes } from "node:crypto";
import { sendNewsletterSignUpConfirmation } from "../shared/newsletter.email";

// Router Serves under /api/newsletter
const router = Router();

const GLOBAL_newsletterSignUpRequests: NewsletterSignUpRequest[] = [];
const GLOBAL_clearOutdatedRequestsInterval = setInterval(
    (): void => {
        for (let i = 0; i < GLOBAL_newsletterSignUpRequests.length; i++) {
            if (Date.now() - GLOBAL_newsletterSignUpRequests[0].timestamp > 60 * 60 * 1000) {
                GLOBAL_newsletterSignUpRequests.shift();
            }
        }
    },
    60 * 60 * 1000,
); // Every Hour

router.post("/signUp", async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, gender } = req.body;

        if (typeof firstName !== "string" || firstName.trim() === "") {
            res.json({
                error: true,
                message: "Bitte gib einen gültigen Vornamen ein.",
                data: {
                    alreadyLoggedIn: false,
                },
            } as AddToNewsletterListApiEndpointResponse);

            return;
        }

        if (typeof lastName !== "string" || lastName.trim() === "") {
            res.json({
                error: true,
                message: "Bitte gib einen gültigen Nachnamen ein.",
                data: {
                    alreadyLoggedIn: false,
                },
            } as AddToNewsletterListApiEndpointResponse);

            return;
        }

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email.trim())) {
            res.json({
                error: true,
                message: "Bitte gib eine gültige E-Mail-Adresse ein.",
                data: {
                    alreadyLoggedIn: false,
                },
            } as AddToNewsletterListApiEndpointResponse);

            return;
        }

        if (gender !== "Herr" && gender !== "Frau" && gender !== "Divers") {
            res.json({
                error: true,
                message: "Ungültige Geschlechtsangabe.",
                data: {
                    alreadyLoggedIn: false,
                },
            } as AddToNewsletterListApiEndpointResponse);

            return;
        }

        const allEmails = await getAllNewsletterEmails();

        if (allEmails.data === null) {
            console.error("DEBUG:\n", allEmails.error);
            throw new Error(PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE);
        }

        if (allEmails.data.includes(email.trim())) {
            res.json({
                error: false,
                message: "Du bist schon eingeloggt.",
                data: {
                    alreadyLoggedIn: true,
                },
            } as AddToNewsletterListApiEndpointResponse);

            return;
        }

        for (const entry of GLOBAL_newsletterSignUpRequests) {
            if (entry.email === email.trim()) {
                res.json({
                    error: true,
                    message: "Du hast schon eine Anfrage gestellt. Bitte klicke auf den Link in deinem Postfach, den du von uns erhalten hast.",
                    data: {
                        alreadyLoggedIn: false,
                    },
                } as AddToNewsletterListApiEndpointResponse);
            }
        }

        const requestId = randomBytes(256).toString("hex");
        const timestamp = Date.now();

        // Add request to the queue
        GLOBAL_newsletterSignUpRequests.push({
            id: requestId,
            email: email.trim(),
            firstName: lastName.trim(),
            lastName: lastName.trim(),
            gender,
            timestamp,
        });

        const isSent = await sendNewsletterSignUpConfirmation(email.trim(), requestId, firstName, lastName, gender, timestamp);

        if (!isSent) {
            res.json({
                error: true,
                message: "Die Bestätigungs-Mail konnte nicht verschickt werden. Bitte versuche es später erneut.",
                data: {
                    alreadyLoggedIn: false,
                },
            } as AddToNewsletterListApiEndpointResponse);
        }

        res.json({
            error: false,
            message: "Du hast dich erfolgreich für den Newsletter angemeldet. Bitte klicke auf den Link in deinem Postfach, den du von uns erhalten hast um die Registrierung abzuschliessen.",
            data: {
                alreadyLoggedIn: false,
            },
        } as AddToNewsletterListApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: {
                    alreadyLoggedIn: false,
                },
            } as AddToNewsletterListApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: "501: Internal Server Error",
            data: {
                alreadyLoggedIn: false,
            },
        } as AddToNewsletterListApiEndpointResponse);
    }
});

export default router;
