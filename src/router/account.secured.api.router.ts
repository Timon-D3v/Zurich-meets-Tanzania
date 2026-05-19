import { Request, Response, Router } from "express";
import { multerInstance } from "../shared/instance.multer";
import { delivApiUpload, delivApiUpdateFile } from "delivapi-client";
import { UpdateUserProfilePictureWithIdApiEndpointResponse } from "..";
import { PUBLIC_CONFIG } from "../publicConfig";
import { setNewProfilePictureWithId } from "../shared/user.database";
import { CONFIG } from "../config";

// Router Serves under /api/secured/account
const router = Router();

router.post("/updateUserProfilePicture", multerInstance.single("image"), async (req: Request, res: Response): Promise<void> => {
    try {
        const file = req.file;
        const user = req.session.user!;

        if (!file) {
            throw new Error("No file uploaded.");
        }

        const allowedMimeTypes = ["application/octet-stream", "image/png", "image/jpg", "image/gif", "image/jpeg", "image/tiff", "image/raw", "image/bpm", "image/webp", "image/ico"];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            console.error("Invalid file mime type for file:", file.originalname, "with mime type:", file.mimetype);
            throw new Error(`Die Datei '${file.originalname}' ist keine gültige Bilddatei. Bitte lade nur Bilddateien hoch.`);
        }

        const response = user.picture === "/svg/personal.svg" ? await delivApiUpload(file.buffer) : await delivApiUpdateFile(user.picture.replace(`${CONFIG.DELIVAPI_URL}/cdn/${CONFIG.DELIVAPI_USER}/`, ""), file.buffer);

        if (response.error) {
            throw new Error("Bild konnte nicht hochgeladen werden: " + response.message);
        }

        const result = await setNewProfilePictureWithId(user.id, response.url);

        if (result.error !== null) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Dein Profilbild wurde erfolgreich aktualisiert.",
            data: {
                pictureUrl: response.url,
            }
        } as UpdateUserProfilePictureWithIdApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null
            } as UpdateUserProfilePictureWithIdApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null
        } as UpdateUserProfilePictureWithIdApiEndpointResponse);
    }
});

export default router;
