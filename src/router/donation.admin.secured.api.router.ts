import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { updateDonationMeterWithId, createDonationMeter, deactivateDonationMeterWithId } from "../shared/donation.database";
import { ApiEndpointResponse } from "..";

// Router Serves under /api/secured/admin/donation
const router = Router();

router.post("/addDonationMeter", async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, target } = req.body;

        if (typeof title !== "string" || title.trim() === "") {
            throw new Error("Bitte gib dem Spendenziel einen Titel.");
        }

        if (typeof description !== "string" || description.trim() === "") {
            throw new Error("Bitte gib dem Spendenziel eine Beschreibung.");
        }

        if (typeof target !== "number" || isNaN(target) || target <= 0) {
            throw new Error("Es konnte kein gültiger Spendenziel-Identifikator gefunden werden. Bitte lade die Seite neu und versuche es erneut.");
        }

        const result = await createDonationMeter(title, description, target);

        if (result.error) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Success",
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

router.post("/deactivateDonationMeter", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.body;

        if (typeof id !== "number" || isNaN(id)) {
            throw new Error("Es konnte kein gültiger Spendenziel-Identifikator gefunden werden. Bitte lade die Seite neu und versuche es erneut.");
        }

        const result = await deactivateDonationMeterWithId(id);

        if (result.error) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Success",
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

router.post("/updateDonationMeter", async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, title, description, currentValue, maxValue } = req.body;

        if (typeof id !== "number" || isNaN(id)) {
            throw new Error("Es konnte kein gültiger Spendenziel-Identifikator gefunden werden. Bitte lade die Seite neu und versuche es erneut.");
        }

        if (typeof title !== "string" || title.trim() === "") {
            throw new Error("Bitte gib dem Spendenziel einen Titel.");
        }

        if (typeof description !== "string" || description.trim() === "") {
            throw new Error("Bitte gib dem Spendenziel eine Beschreibung.");
        }

        if (typeof currentValue !== "number" || isNaN(currentValue)) {
            throw new Error("Bitte gib dem Spendenziel einen gültigen aktuellen Wert.");
        }

        if (typeof maxValue !== "number" || isNaN(maxValue)) {
            throw new Error("Bitte gib dem Spendenziel einen gültigen Maximalwert.");
        }

        const result = await updateDonationMeterWithId(id, title, description, currentValue, maxValue);

        if (result.error) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Success",
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
