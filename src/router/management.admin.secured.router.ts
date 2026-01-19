import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { ApiEndpointResponse, GetPasswordsApiEndpointResponse, PrivateUser, StaticSite } from "../index.js";
import { PASSWORDS } from "../shared/passwords";
import { createUser, getUserWithEmail, setUserType } from "../shared/user.database";
import { getMemberWithEmail } from "../shared/member.database";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { createDarkmodeEntry } from "../shared/darkmode.database";
import { sendPasswordFromAdmin } from "../shared/auth.email";
import multerInstance from "../shared/instance.multer";
import { delivApiUpdateFile, delivApiUpload } from "delivapi-client";
import { CONFIG } from "../config";
import { updateStaticSite } from "../shared/subpages.database";

// Router Serves under /api/secured/admin/management
const router = Router();

router.get("/getPasswords", (req: Request, res: Response): void => {
    try {
        res.json({
            error: false,
            message: "Passwords retrieved successfully",
            data: PASSWORDS,
        } as GetPasswordsApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetPasswordsApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetPasswordsApiEndpointResponse);
    }
});

router.post("/addAdmin", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            throw new Error("Bitte gib eine gültige E-Mail-Adresse ein.");
        }

        const user = await getUserWithEmail(email);

        if (user.error !== null) {
            throw new Error(user.error);
        }

        if (user.data.length === 0) {
            throw new Error("Es existiert kein Benutzer mit dieser E-Mail-Adresse.");
        }

        if (user.data[0].type === "admin") {
            throw new Error("Der Benutzer ist bereits ein Admin.");
        }

        const result = await setUserType(email, "admin");

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Der Benutzer wurde erfolgreich zum Admin ernannt.",
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

router.post("/removeAdmin", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            throw new Error("Bitte gib eine gültige E-Mail-Adresse ein.");
        }

        const databaseResult = await getUserWithEmail(email);

        if (databaseResult.error !== null) {
            throw new Error(databaseResult.error);
        }

        if (databaseResult.data.length === 0) {
            throw new Error("Es existiert kein Benutzer mit dieser E-Mail-Adresse.");
        }

        if (databaseResult.data[0].type !== "admin") {
            throw new Error("Der Benutzer ist kein Admin.");
        }

        const user: PrivateUser = databaseResult.data[0];

        const member = await getMemberWithEmail(user.id);

        if (member.error !== null) {
            throw new Error(member.error);
        }

        let type: "user" | "member" = "user";

        if (member.data.length > 0) {
            // User is also a member
            type = "member";
        }

        const result = await setUserType(email, type);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Dem Benutzer wurden erfolgreich die Admin-Rechte entzogen.",
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

router.post("/createUser", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, firstName, lastName, address } = req.body;

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            throw new Error("Bitte gib eine gültige E-Mail-Adresse ein.");
        }

        if (typeof firstName !== "string" || firstName.trim() === "") {
            throw new Error("Bitte gib einen gültigen Vornamen ein.");
        }

        if (typeof lastName !== "string" || lastName.trim() === "") {
            throw new Error("Bitte gib einen gültigen Nachnamen ein.");
        }

        if (typeof address !== "string" || address.trim() === "") {
            throw new Error("Bitte gib eine gültige Adresse ein.");
        }

        const userList = await getUserWithEmail(email);

        if (userList.error !== null) {
            throw new Error(userList.error);
        }

        if (userList.data.length !== 0) {
            throw new Error(`Es gibt bereits einen Account mit der E-Mail-Adresse '${email}'. Bitte benutze eine andere E-Mail-Adresse.`);
        }

        const password = randomBytes(10).toString("hex");

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await createUser(email, passwordHash, firstName, lastName, address, "Keine Nummer", "/svg/personal.svg");

        if (result.error !== null) {
            throw new Error(result.error);
        }

        const databaseResult = await getUserWithEmail(email);

        if (databaseResult.error !== null) {
            throw new Error(databaseResult.error);
        }

        const user: PrivateUser = databaseResult.data[0];

        const darkmodeResult = await createDarkmodeEntry(user.id);

        if (darkmodeResult.error !== null) {
            throw new Error(
                darkmodeResult.error +
                    " \nDas Benutzerkonto wurde aber erfolgreich erstellt. Allerdings wurde keine Darkmode-Einstellung angelegt und die E-Mail mit dem Passwort wurde nicht gesendet. Das Passwort lautet: " +
                    password +
                    ". Bitte teile dies dem Benutzer mit.",
            );
        }

        const sentSuccessfully = await sendPasswordFromAdmin(password, email, firstName, lastName);

        if (!sentSuccessfully) {
            throw new Error("Das Benutzerkonto wurde erfolgreich erstellt. Allerdings wurde die E-Mail mit dem Passwort nicht gesendet. Das Passwort lautet: " + password + ". Bitte teile dies dem Benutzer mit.");
        }

        res.json({
            error: false,
            message: `Der Benutzer mit der E-Mail "${email}" wurde erfolgreich erstellt. Das Passwort wurde an diese E-Mail-Adresse gesendet.`,
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

router.post("/changeHomepagePicture", multerInstance.single("picture"), async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file;

        if (!file) {
            throw new Error("Es wurde kein Bild hochgeladen.");
        }

        const allowedMimeTypes = ["application/octet-stream", "image/png", "image/jpg", "image/gif", "image/jpeg", "image/tiff", "image/raw", "image/bpm", "image/webp", "image/ico"];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error("Bitte lade eine gültige Bilddatei hoch.");
        }

        const filename = "7a121"; // This is the test entry for every organization and is always there

        const response = await delivApiUpdateFile(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, filename, file.buffer, file.originalname);

        if (response.error) {
            throw new Error("Das Bild konnte nicht hochgeladen werden. Bitte versuche es später erneut. Weitere Informationen: " + response.message);
        }

        res.json({
            error: false,
            message: "Das Homepage-Bild wurde erfolgreich aktualisiert.",
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

router.post("/updateStaticSite", multerInstance.array("images"), async (req: Request, res: Response): Promise<void> => {
    try {
        const siteName = req.body.siteName;
        const site = JSON.parse(req.body.site);
        const imageNames = JSON.parse(req.body.imageNames);
        const files = req.files || [];

        if (
            typeof siteName !== "string" ||
            ![
                "vision",
                "board",
                "beginning",
                "finances",
                "income-statement",
                "general-meeting",
                "statutes",
                "zurich-meets-tanzania",
                "tanzania-meets-zurich",
                "mbuzi",
                "gynecology",
                "meducation",
                "bajaji",
                "cardiology",
                "surgery",
                "history",
            ].includes(siteName)
        ) {
            throw new Error("SiteName is not valid.");
        }

        if (typeof site !== "object" || site === null) {
            throw new Error("Site structure is not valid.");
        }

        if (!Array.isArray(imageNames)) {
            throw new Error("Image names list is not valid.");
        }

        for (const imageName of imageNames) {
            if (typeof imageName !== "string" || imageName.trim() === "") {
                throw new Error("Image names list is not valid.");
            }
        }

        if (!Array.isArray(files)) {
            throw new Error("Image list is not valid.");
        }

        if (
            typeof site.metadata !== "object" ||
            typeof site.metadata.title !== "string" ||
            typeof site.metadata.subtitle !== "string" ||
            typeof site.metadata.author !== "string" ||
            typeof site.metadata.imageUrl !== "string" ||
            typeof site.metadata.imageAlt !== "string"
        ) {
            throw new Error("Site Metadata is not valid");
        }

        if (!Array.isArray(site.data)) {
            throw new Error("Site Data is not valid");
        }

        const { data, metadata } = site as StaticSite;

        const allowedMimeTypes = ["application/octet-stream", "image/png", "image/jpg", "image/gif", "image/jpeg", "image/tiff", "image/raw", "image/bpm", "image/webp", "image/ico"];

        for (const file of files) {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                console.error("Invalid file mime type for file:", file.originalname, "with mime type:", file.mimetype);
                throw new Error(`Die Datei '${file.originalname}' ist keine gültige Bilddatei. Bitte lade nur Bilddateien hoch.`);
            }
        }

        // Validation recap
        // - siteName is valid
        // - site is an object
        // - imageNames is an array of strings
        // - files is an array
        // - site metadata is valid
        // - site data is valid
        // - all files have valid mime types

        const IMAGE_FALLBACK_URL = "/backup/fallback.png";

        // Upload images

        let failedUploads = 0;

        // Check hero image and then loop over the rest
        if (imageNames.includes(metadata.imageUrl)) {
            try {
                const fileIndex = imageNames.indexOf(metadata.imageUrl);

                const file = files[fileIndex];

                const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.originalname);

                if (response.error) {
                    // Don't abort, just set fallback image
                    throw new Error(response.message);
                }

                metadata.imageUrl = response.url;
            } catch (error) {
                console.error("Error uploading image:", (error as Error).message);

                failedUploads++;

                metadata.imageUrl = IMAGE_FALLBACK_URL;
            }
        }

        for (const element of data) {
            if (element.type === "image" || element.type === "imageWithText") {
                if (imageNames.includes(element.imageUrl)) {
                    try {
                        const fileIndex = imageNames.indexOf(element.imageUrl);

                        const file = files[fileIndex];

                        const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.originalname);

                        if (response.error) {
                            // Don't abort, just set fallback image
                            throw new Error(response.message);
                        }

                        element.imageUrl = response.url;
                    } catch (error) {
                        console.error("Error uploading image:", (error as Error).message);

                        failedUploads++;

                        element.imageUrl = IMAGE_FALLBACK_URL;
                    }
                }
            } else if (element.type === "multipleImages") {
                for (const image of element.images) {
                    if (imageNames.includes(image.imageUrl)) {
                        try {
                            const fileIndex = imageNames.indexOf(image.imageUrl);

                            const file = files[fileIndex];

                            const response = await delivApiUpload(CONFIG.DELIVAPI_USER, CONFIG.DELIVAPI_KEY, file.buffer, file.originalname);

                            if (response.error) {
                                // Don't abort, just set fallback image
                                throw new Error(response.message);
                            }

                            image.imageUrl = response.url;
                        } catch (error) {
                            console.error("Error uploading image:", (error as Error).message);

                            failedUploads++;

                            image.imageUrl = IMAGE_FALLBACK_URL;
                        }
                    }
                }
            }
        }

        // All images uploaded (or failed), now save the site structure
        const result = await updateStaticSite(
            siteName as
                | "vision"
                | "board"
                | "beginning"
                | "finances"
                | "income-statement"
                | "general-meeting"
                | "statutes"
                | "zurich-meets-tanzania"
                | "tanzania-meets-zurich"
                | "mbuzi"
                | "gynecology"
                | "meducation"
                | "bajaji"
                | "cardiology"
                | "surgery"
                | "history",
            { metadata, data },
        );

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message:
                failedUploads === 0
                    ? `Die Seite mit id '${siteName}' wurde erfolgreich aktualisiert.`
                    : `Die Seite mit id '${siteName}' wurde aktualisiert, jedoch konnten ${failedUploads}/${files.length} Bilder nicht hochgeladen werden und wurden durch ein Fallback-Bild ersetzt.`,
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

export default router;
