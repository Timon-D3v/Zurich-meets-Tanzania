import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

const storage = multer.memoryStorage();

const multerInstance = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 * 1024, // 10Gb
    },
    fileFilter: (_req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
        if (file.size === 0) {
            callback(new Error("No valid file uploaded."));
        }

        callback(null, true);
    },
});

export default multerInstance;

export { multerInstance };
