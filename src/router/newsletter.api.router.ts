import { Request, Response, Router } from "express";
import { AddToNewsletterListApiEndpointResponse, ApiEndpointResponse, GetNewsletterUnsubscribeRequestVerificationTokenApiEndpointResponse, NewsletterSignUpRequest, NewsletterUnsubscribeRequests, NewsletterUser } from "..";
import { addToNewsletterList, getAllNewsletterEmails, getNewsletterDetailsWithEmail, removeFromNewsletterList } from "../shared/newsletter.database.js";
import { PUBLIC_CONFIG } from "../publicConfig.js";
import { randomBytes } from "node:crypto";
import { sendNewsletterSignOutConfirmation, sendNewsletterSignUpConfirmation } from "../shared/newsletter.email.js";
import { RowDataPacket } from "mysql2";

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
const GLOBAL_unsubscribeConfirmRequests: NewsletterUnsubscribeRequests[] = [];
const GLOBAL_clearOutdatedUnsubscribeRequestsInterval = setInterval(
    (): void => {
        for (let i = 0; i < GLOBAL_unsubscribeConfirmRequests.length; i++) {
            if (Date.now() - GLOBAL_unsubscribeConfirmRequests[0].timestamp > 60 * 60 * 1000) {
                GLOBAL_unsubscribeConfirmRequests.shift();
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

        if (typeof email !== "string" || email.trim() === "" || !PUBLIC_CONFIG.REGEX.MATCH_VALID_EMAIL.test(email.trim())) {
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

        if (allEmails.data.map((email: RowDataPacket) => email["email"]).includes(email.trim())) {
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

        // Add request to the queue
        GLOBAL_newsletterSignUpRequests.push({
            id: requestId,
            email: email.trim(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender,
            timestamp,
            used: false,
        });

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
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: {
                alreadyLoggedIn: false,
            },
        } as AddToNewsletterListApiEndpointResponse);
    }
});

router.post("/confirm", async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, gender, id, timestamp } = req.body;

        if (typeof firstName !== "string" || typeof lastName !== "string" || typeof email !== "string" || typeof gender !== "string" || typeof id !== "string" || typeof timestamp !== "string") {
            res.json({
                error: true,
                message: PUBLIC_CONFIG.ERROR.BAD_REQUEST,
            } as ApiEndpointResponse);

            return;
        }

        for (let i = 0; i < GLOBAL_newsletterSignUpRequests.length; i++) {
            if (
                GLOBAL_newsletterSignUpRequests[i].id !== id ||
                GLOBAL_newsletterSignUpRequests[i].email !== email ||
                GLOBAL_newsletterSignUpRequests[i].firstName !== firstName ||
                GLOBAL_newsletterSignUpRequests[i].lastName !== lastName ||
                GLOBAL_newsletterSignUpRequests[i].gender !== gender ||
                GLOBAL_newsletterSignUpRequests[i].timestamp !== Number(timestamp)
            ) {
                continue;
            }

            if (GLOBAL_newsletterSignUpRequests[i].used) {
                res.json({
                    error: true,
                    message: "Diese Anfrage wurde schon bearbeitet und du bist wahrscheinlich schon angemeldet. Du kannst dies überprüfen, indem du versuchst dich noch einmal anzumelden.",
                });

                return;
            }

            const result = await addToNewsletterList(GLOBAL_newsletterSignUpRequests[i].email, GLOBAL_newsletterSignUpRequests[i].firstName, GLOBAL_newsletterSignUpRequests[i].lastName, GLOBAL_newsletterSignUpRequests[i].gender);

            if (result.error === null) {
                res.json({
                    error: false,
                    message: "Erfolgreich für den Newsletter angemeldet.",
                });

                GLOBAL_newsletterSignUpRequests[i].used = true;

                return;
            }

            res.json({
                error: true,
                message: result.error,
            } as ApiEndpointResponse);

            return;
        }

        res.json({
            error: true,
            message: "Der Link ist nicht (mehr) gültig. Bitte versuche es noch einmal oder registriere dich erneut.",
        } as ApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            } as ApiEndpointResponse);

            return;
        }

        res.json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
        } as ApiEndpointResponse);
    }
});

router.post("/unsubscribe", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (typeof email !== "string" || email.trim() === "" || !PUBLIC_CONFIG.REGEX.MATCH_VALID_EMAIL.test(email)) {
            throw new Error("Invalid parameter 'email'.");
        }

        // Get user data

        const result = await getNewsletterDetailsWithEmail(email);

        if (result.error || result.data === null) {
            throw new Error(result.error);
        }

        if (result.data.length === 0) {
            throw new Error("Du bist nicht auf der Newsletterliste. Es gibt nichts mehr zu tun.");
        }

        const user = result.data[0] as NewsletterUser;

        // Set up a confirm request

        const code = randomBytes(5).toString("hex");
        const token = randomBytes(32).toString("hex");

        const sentSuccessfully = await sendNewsletterSignOutConfirmation(user.email, code, user.firstName, user.lastName, user.gender);

        if (!sentSuccessfully) {
            throw new Error("Failed to send verification email.");
        }

        GLOBAL_unsubscribeConfirmRequests.push({
            token,
            verificationCode: code,
            timestamp: Date.now(),
            email: user.email,
        });

        res.json({
            error: false,
            message: "Success",
            data: {
                token,
            },
        } as GetNewsletterUnsubscribeRequestVerificationTokenApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetNewsletterUnsubscribeRequestVerificationTokenApiEndpointResponse);

            return;
        }

        res.json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetNewsletterUnsubscribeRequestVerificationTokenApiEndpointResponse);
    }
});

router.post("/confirmUnsubscribe", async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, code } = req.body;
        if (typeof token !== "string" || !/^[a-z0-9]{64}$/.test(token.toLowerCase())) {
            throw new Error("Invalid parameter 'token'");
        }

        if (typeof code !== "string" || !/^[a-z0-9]{10}$/.test(code.toLowerCase())) {
            throw new Error("Invalid parameter 'code'");
        }

        for (let i = 0; i < GLOBAL_unsubscribeConfirmRequests.length; i++) {
            if (GLOBAL_unsubscribeConfirmRequests[i].token !== token || GLOBAL_unsubscribeConfirmRequests[i].verificationCode !== code) {
                continue;
            }

            const result = await removeFromNewsletterList(GLOBAL_unsubscribeConfirmRequests[i].email);

            if (result.error === null) {
                res.json({
                    error: false,
                    message: "Erfolgreich vom Newsletter abgemeldet.",
                });

                GLOBAL_unsubscribeConfirmRequests.splice(i, 1);

                return;
            }

            res.json({
                error: true,
                message: result.error,
            } as ApiEndpointResponse);

            return;
        }

        res.json({
            error: true,
            message: "Der Bestätigungscode ist nicht (mehr) gültig. Bitte versuche es noch einmal.",
        } as ApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            } as ApiEndpointResponse);

            return;
        }

        res.json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
        } as ApiEndpointResponse);
    }
});

export default router;
