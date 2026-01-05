import { Request, Response, Router } from "express";
import { ApiEndpointResponse, GetPublicUserDetailsApiEndpointResponse, ApiEndpointResponseWithRedirect, PasswordRecoveryRequest, PrivateUser, PublicUser, SignUpConfirmRequest } from "..";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { PUBLIC_CONFIG } from "../publicConfig";
import { sendNewPassword, sendPasswordRecoveryConfirmationCode, sendSignUpConfirmationCode } from "../shared/auth.email";
import multerInstance from "../shared/instance.multer";
import { delivApiUpload } from "delivapi-client";
import { CONFIG } from "../config";
import { createDarkmodeEntry } from "../shared/darkmode.database";
import { createUser, getUserWithEmail, setNewPassword } from "../shared/user.database";

// Router Serves under /api/auth
const router = Router();

const GLOBAL_passwordRecoveryRequests: PasswordRecoveryRequest[] = [];
const GLOBAL_signUpConfirmRequests: SignUpConfirmRequest[] = [];
const GLOBAL_clearOutdatedRequestsInterval = setInterval(
    (): void => {
        for (let i = 0; i < GLOBAL_passwordRecoveryRequests.length; i++) {
            if (Date.now() - GLOBAL_passwordRecoveryRequests[0].timestamp > 60 * 60 * 1000) {
                GLOBAL_passwordRecoveryRequests.shift();
            }
        }

        for (let i = 0; i < GLOBAL_signUpConfirmRequests.length; i++) {
            if (Date.now() - GLOBAL_signUpConfirmRequests[0].timestamp > 60 * 60 * 1000) {
                GLOBAL_signUpConfirmRequests.shift();
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

router.post("/signup", multerInstance.single("picture"), async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName, address, postalCode, city, phone, hasPicture } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            typeof firstName !== "string" ||
            typeof lastName !== "string" ||
            typeof address !== "string" ||
            typeof postalCode !== "string" ||
            typeof city !== "string" ||
            typeof phone !== "string" ||
            typeof hasPicture !== "string"
        ) {
            throw new Error("Invalid or missing parameter.");
        }

        if (email.trim() === "" || password.trim() === "" || firstName.trim() === "" || lastName.trim() === "" || address.trim() === "" || postalCode.trim() === "" || city.trim() === "") {
            throw new Error("Invalid parameter found.");
        }

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            throw new Error("Invalid parameter 'email'.");
        }

        if (!/^(?:[A-Z]{2}-\d{3,6}|\d{3,6})$/.test(postalCode)) {
            throw new Error("Invalid parameter 'postalCode'.");
        }

        if ((phone !== "" && phone.length > 15) || (phone !== "" && /[^0-9\+\ ]/.test(phone))) {
            throw new Error("Invalid parameter 'phone'");
        }

        if (hasPicture === "true" && typeof req.file === "undefined") {
            throw new Error("Invalid file uploaded.");
        }

        if (hasPicture === "true" && !["application/octet-stream", "image/png", "image/jpg", "image/gif", "image/jpeg", "image/tiff", "image/raw", "image/bpm", "image/webp", "image/ico"].includes(req.file?.mimetype || "")) {
            throw new Error("Invalid mimetype of uploaded file.");
        }

        const userList = await getUserWithEmail(email);

        if (userList.error !== null || userList.data === null) {
            res.json({
                error: true,
                message: userList.error,
            } as ApiEndpointResponse);

            return;
        }

        if (userList.data.length !== 0) {
            res.json({
                error: true,
                message: `Es gibt bereits einen Account mit der E-Mail-Adresse '${email}'. Bitte logge dich damit ein oder benutze eine andere E-Mail-Adresse.`,
            } as ApiEndpointResponse);

            return;
        }

        // Set up a confirm request
        const code = randomBytes(10).toString("hex");

        GLOBAL_signUpConfirmRequests.push({
            code,
            user: {
                email,
                password,
                firstName,
                lastName,
                address: `${address}, ${postalCode} ${city}`,
                phone,
                hasPicture: hasPicture === "true",
                pictureFile: req.file,
            },
            timestamp: Date.now(),
        });

        const sentSuccessfully = await sendSignUpConfirmationCode(code, email, firstName, lastName);

        res.json({
            error: !sentSuccessfully,
            message: sentSuccessfully ? `Bestätigungscode erfolgreich an ${firstName} ${lastName} über die E-Mail-Adresse '${email}' geschickt.` : PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
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

router.post("/confirmSignUp", async (req: Request, res: Response) => {
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

        let requestId = -1;

        for (let i = 0; i < GLOBAL_signUpConfirmRequests.length; i++) {
            if (GLOBAL_signUpConfirmRequests[i].user.email === email) {
                requestId = i;
            }
        }

        if (requestId === -1) {
            res.json({
                error: true,
                message: `Es wurde keine Registrierungsanfrage für die E-Mail '${email}' gefunden. Möglicherweise ist die Anfrage auch schon abgelaufen. Bitte registriere dich erneut.`,
                data: {
                    redirectUrl: "/signup",
                },
            } as ApiEndpointResponseWithRedirect);

            return;
        }

        const request = GLOBAL_signUpConfirmRequests[requestId];

        if (request.code !== code) {
            res.json({
                error: true,
                message: `Die Registrierungsanfrage für die E-Mail '${email}' wurde gefunden, aber der eingegebene Code stimmt nicht überein. Bitte überprüfe deine Eingabe und versuche es erneut.`,
                data: {
                    redirectUrl: "/signup-confirm",
                    queryParams: {
                        email,
                    },
                },
            } as ApiEndpointResponseWithRedirect);

            return;
        }

        // Now the request is confirmed
        let pictureUrl: string = "/svg/personal.svg";

        if (request.user.hasPicture) {
            try {
                const file = request.user.pictureFile;

                if (!file || file === undefined || typeof file === "undefined") {
                    throw new Error("File is undefined but hasPicture was 'true'");
                }

                const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.mimetype);

                if (response.error) {
                    throw new Error(response.message);
                }

                pictureUrl = response.url ?? "/svg/personal.svg";
            } catch (error) {
                console.error("An error happened while uploading the profile picture:");

                if (error instanceof Error) {
                    console.error(error.message);
                }

                console.info("The signup request will be continued anyways.");
            }
        }

        const passwordHash = await bcrypt.hash(request.user.password, 10);

        const result = await createUser(request.user.email, passwordHash, request.user.firstName, request.user.lastName, request.user.address, request.user.phone, pictureUrl);

        if (result.error !== null) {
            res.json({
                error: true,
                message: result.error,
            });

            return;
        }

        const data = await getUserWithEmail(email);

        if (data.data === null) {
            throw new Error(PUBLIC_CONFIG.ERROR.INTERNAL_ERROR);
        }

        const user = data.data[0] as PrivateUser;

        const darkmodeResult = await createDarkmodeEntry(user.id);

        if (darkmodeResult.error !== null) {
            throw new Error(darkmodeResult.error);
        }

        req.session.isLoggedIn = true;
        req.session.user = user;

        // Everything is done so we can delete the request from the Array
        for (let i = 0; i < GLOBAL_signUpConfirmRequests.length; i++) {
            if (GLOBAL_signUpConfirmRequests[i].user.email === email) {
                GLOBAL_signUpConfirmRequests.splice(i, 1);
            }
        }

        res.json({
            error: false,
            message: `Dein Account mit der E-Mail '${email}' wurde erfolgreich erstellt.`,
            data: {
                redirectUrl: "/",
            },
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
                        firstName: req.session.user?.firstName,
                        lastName: req.session.user?.lastName,
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
                    redirectUrl: null,
                },
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
                            email: userData.email,
                        },
                    },
                } as ApiEndpointResponseWithRedirect);
                return;
            }
        }

        const recoveryCode = randomBytes(10).toString("hex");

        GLOBAL_passwordRecoveryRequests.push({
            code: recoveryCode,
            user: userData,
            timestamp: Date.now(),
        });

        const sentSuccessfully = await sendPasswordRecoveryConfirmationCode(recoveryCode, userData.email, userData.firstName, userData.lastName);

        res.json({
            error: !sentSuccessfully,
            message: sentSuccessfully ? `Bestätigungscode erfolgreich an ${userData.firstName} ${userData.lastName} über die E-Mail-Adresse '${userData.email}' geschickt.` : PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: {
                redirectUrl: "/password-recovery-confirm",
                queryParams: {
                    email: userData.email,
                },
            },
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
                    redirectUrl: "/password-recovery",
                },
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
                            redirectUrl: "/password-recovery",
                        },
                    } as ApiEndpointResponseWithRedirect);

                    return;
                }

                const sentSuccessfully = await sendNewPassword(newPassword, userData.email, userData.firstName, userData.lastName);

                if (sentSuccessfully) {
                    // Delete the request
                    for (let i = 0; i < GLOBAL_passwordRecoveryRequests.length; i++) {
                        if (GLOBAL_passwordRecoveryRequests[i].code === code) {
                            GLOBAL_passwordRecoveryRequests.splice(i, 1);
                        }
                    }

                    res.json({
                        error: false,
                        message: "Dein Passwort wurde erfolgreich zurückgesetzt.",
                        data: {
                            redirectUrl: "/login",
                        },
                    } as ApiEndpointResponseWithRedirect);

                    return;
                }

                res.json({
                    error: true,
                    message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
                    data: {
                        redirectUrl: "/password-recovery",
                    },
                } as ApiEndpointResponseWithRedirect);

                return;
            }
        }

        const requestNotFound =
            GLOBAL_passwordRecoveryRequests.filter((request: PasswordRecoveryRequest) => {
                return request.user.email === userData.email;
            }).length === 0;

        console.log(GLOBAL_passwordRecoveryRequests);

        res.json({
            error: true,
            message: requestNotFound ? `Es wurde keine Anfrage für die E-Mail '${userData.email}' gefunden oder sie ist bereits abgelaufen.` : `Der eingegebene Bestätigungscode für die Anfrage der E-Mail '${userData.email}' ist leider falsch.`,
            data: {
                redirectUrl: requestNotFound ? "/password-recovery" : null,
            },
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
