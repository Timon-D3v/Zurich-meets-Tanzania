import { Request, Response, Router } from "express";
import { getUserWithEmail } from "../shared/auth.database";
import { ApiEndpointResponse, GetPublicUserDetailsApiEndpointResponse, ApiEndpointResponseWithRedirect, PasswordRecoveryRequest, PrivateUser, PublicUser } from "..";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { PUBLIC_CONFIG } from "../publicConfig";
import { sendNewPassword, sendPasswordRecoveryConfirmationCode } from "../shared/passwordRecovery.email";
import { setNewPassword } from "../shared/setNewPassword.database";

// Router Serves under /api/auth
const router = Router();

const GLOBAL_passwordRecoveryRequests: PasswordRecoveryRequest[] = [];
const GLOBAL_clearOutdatedRequestsInterval = setInterval(
    (): void => {
        for (let i = 0; i < GLOBAL_passwordRecoveryRequests.length; i++) {
            if (Date.now() - GLOBAL_passwordRecoveryRequests[0].timestamp > 60 * 60 * 1000) {
                GLOBAL_passwordRecoveryRequests.shift();
            }
        }
    },
    60 * 60 * 1000,
); // Every Hour

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (typeof email === "undefined" || typeof password === "undefined") {
            throw new Error("Missing parameter 'email' or 'password'.");
        }

        if (typeof email !== "string" || typeof password !== "string") {
            throw new Error("Invalid parameter 'email' or 'password'.");
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            throw new Error("Invalid parameter 'email'.");
        }

        const user = await getUserWithEmail(email);

        if (user.data === null) {
            console.error("DEBUG:\n", user.error);
            throw new Error(PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE);
        }

        if (user.data.length === 0) {
            // This is a error that could happen in the frontend
            // That means that we do not want a status of 501 and a readable error message
            res.json({
                error: true,
                message: `Es wurde kein Account mit der E-Mail '${email}' gefunden.`,
            } as ApiEndpointResponse);
            return;
        }

        if (user.data.length > 1) {
            throw new Error("Multiple users with same email found.");
        }

        const data = user.data[0] as PrivateUser;

        const comparison = await bcrypt.compare(password, data.password);

        if (!comparison) {
            res.json({
                error: true,
                message: `Das eingegebene Passwort stimmt nicht mit der E-Mail '${email}' überein. Bitte versuche es noch einmal.`,
            } as ApiEndpointResponse);
            return;
        }

        req.session.isLoggedIn = true;
        req.session.user = data;

        res.json({
            error: false,
            message: `Erfolgreich eingeloggt mit E-Mail '${email}'.`,
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

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
        } as ApiEndpointResponse);
    }
});

router.get("/getUserDetails", (req: Request, res: Response): void => {
    try {
        if (req.session.isLoggedIn) {
            res.json({
                error: false,
                message: "Success",
                data: {
                    isLoggedIn: req.session.isLoggedIn,
                    user: {
                        email: req.session.user?.email,
                        name: req.session.user?.name,
                        family_name: req.session.user?.family_name,
                        address: req.session.user?.address,
                        phone: req.session.user?.phone,
                        picture: req.session.user?.picture,
                        type: req.session.user?.type,
                    } as PublicUser,
                },
            } as GetPublicUserDetailsApiEndpointResponse);

            return;
        }

        res.json({
            error: false,
            message: "Success",
            data: {
                isLoggedIn: false,
                user: null,
            },
        } as GetPublicUserDetailsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            } as GetPublicUserDetailsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
        } as GetPublicUserDetailsApiEndpointResponse);
    }
});

router.post("/logout", (req: Request, res: Response) => {
    try {
        req.session.isLoggedIn = false;
        req.session.user = null;

        res.json({
            error: false,
            message: "Erfolgreich ausgeloggt.",
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

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
        } as ApiEndpointResponse);
    }
});

router.post("/startPasswordRecovery", async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (typeof email === "undefined") {
            throw new Error("Missing parameter 'email'.");
        }

        if (typeof email !== "string" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            throw new Error("Invalid parameter 'email'.");
        }

        const user = await getUserWithEmail(email);

        if (user.data === null) {
            console.error("DEBUG:\n", user.error);
            throw new Error(PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE);
        }

        if (user.data.length === 0) {
            // This is a error that could happen in the frontend
            // That means that we do not want a status of 501 and a readable error message
            res.json({
                error: true,
                message: `Es wurde kein Account mit der E-Mail '${email}' gefunden.`,
                data: {
                    redirectUrl: null
                }
            } as ApiEndpointResponseWithRedirect);
            return;
        }

        if (user.data.length > 1) {
            throw new Error("Multiple users with same email found.");
        }

        const userData = user.data[0] as PrivateUser;

        for (const request of GLOBAL_passwordRecoveryRequests) {
            if (request.user.email === userData.email) {
                // This is a error that could happen in the frontend
                // That means that we do not want a status of 501 and a readable error message
                res.json({
                    error: true,
                    message: `Für die E-Mail '${email}' gibt es bereits einen gültigen Code, bitte benutze diesen.`,
                    data: {
                        redirectUrl: "/password-recovery-confirm",
                        queryParams: {
                            email: userData.email
                        }
                    }
                } as ApiEndpointResponseWithRedirect);
                return;
            }
        }

        const recoveryCode = randomBytes(10).toString("hex");

        console.log(recoveryCode);

        GLOBAL_passwordRecoveryRequests.push({
            code: recoveryCode,
            user: userData,
            timestamp: Date.now(),
        });

        console.log(GLOBAL_passwordRecoveryRequests);

        const sentSuccessfully = await sendPasswordRecoveryConfirmationCode(recoveryCode, userData.email, userData.name, userData.family_name);

        res.json({
            error: !sentSuccessfully,
            message: sentSuccessfully ? `Bestätigungscode erfolgreich an ${userData.name} ${userData.family_name} über die E-Mail-Adresse '${userData.email}'.` : PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: {
                redirectUrl: "/password-recovery-confirm",
                queryParams: {
                    email: userData.email
                }
            }
        } as ApiEndpointResponseWithRedirect);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            } as ApiEndpointResponseWithRedirect);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
        } as ApiEndpointResponseWithRedirect);
    }
});

router.post("/confirmPasswordRecovery", async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        if (typeof email === "undefined" || typeof code === "undefined") {
            throw new Error("Missing parameter 'email' or 'code'.");
        }

        if (typeof code !== "string") {
            throw new Error("Invalid parameter 'code'.");
        }

        if (typeof email !== "string" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            throw new Error("Invalid parameter 'email'.");
        }

        const user = await getUserWithEmail(email);

        if (user.data === null) {
            console.error("DEBUG:\n", user.error);
            throw new Error(PUBLIC_CONFIG.ERROR.NO_CONNECTION_TO_DATABASE);
        }

        if (user.data.length === 0) {
            // This is a error that could happen in the frontend
            // That means that we do not want a status of 501 and a readable error message
            res.json({
                error: true,
                message: `Es wurde kein Account mit der E-Mail '${email}' gefunden.`,
                data: {
                    redirectUrl: "/password-recovery"
                }
            } as ApiEndpointResponseWithRedirect);
            return;
        }

        if (user.data.length > 1) {
            throw new Error("Multiple users with same email found.");
        }

        const userData = user.data[0] as PrivateUser;

        for (const request of GLOBAL_passwordRecoveryRequests) {
            if (request.code === code && request.user.email === userData.email && request.user.password === userData.password) {
                // If the code, email (and password for added safety) match, the password recovery can execute.
                const newPassword = randomBytes(16).toString("hex");

                const newPasswordHash = await bcrypt.hash(newPassword, 10);

                const result = await setNewPassword(request.user.email, newPasswordHash);

                if (result.data === null) {
                    res.json({
                        error: true,
                        message: result.error,
                        data: {
                            redirectUrl: "/password-recovery"
                        }
                    } as ApiEndpointResponseWithRedirect);

                    return;
                }

                const sentSuccessfully = await sendNewPassword(newPassword, userData.email, userData.name, userData.family_name);

                if (sentSuccessfully) {
                    // Delete the request
                    for (let i = 0; i < GLOBAL_passwordRecoveryRequests.length; i++) {
                        if (GLOBAL_passwordRecoveryRequests[i].code === code) {
                            GLOBAL_passwordRecoveryRequests.slice(i, 1);
                        }
                    }

                    res.json({
                        error: false,
                        message: "Dein Passwort wurde erfolgreich zurückgesetzt.",
                        data: {
                            redirectUrl: "/login"
                        }
                    } as ApiEndpointResponseWithRedirect);

                    return;
                }

                res.json({
                    error: true,
                    message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
                    data: {
                        redirectUrl: "/password-recovery"
                    }
                } as ApiEndpointResponseWithRedirect);

                return;
            }
        }

        const requestNotFound = GLOBAL_passwordRecoveryRequests.filter(
            (request: PasswordRecoveryRequest) => {
                return request.user.email === userData.email;
            }
        ).length === 0;

        console.log(GLOBAL_passwordRecoveryRequests)

        res.json({
            error: true,
            message:
                    requestNotFound
                    ? `Es wurde keine Anfrage für die E-Mail '${userData.email}' gefunden oder sie ist bereits abgelaufen.`
                    : `Der eingegebene Bestätigungscode für die Anfrage der E-Mail '${userData.email}' ist leider falsch.`,
                data: {
                    redirectUrl: requestNotFound ? "/password-recovery" : null
                }
        } as ApiEndpointResponseWithRedirect);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            } as ApiEndpointResponseWithRedirect);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
        } as ApiEndpointResponseWithRedirect);
    }
});

export default router;
