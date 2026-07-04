import { Request, Response, Router } from "express";
import { PUBLIC_CONFIG } from "../publicConfig";
import { CONFIG } from "../config";
import { GetDonationUsageTypesApiEndpointResponse, ApiEndpointResponse, GetDonationMetersApiEndpointResponse } from "..";
import { getAllDonationUsageTypes, insertDonationRequest, getAllDonationMeters } from "../shared/donation.database";
import { sendDonationRequestEmail } from "../shared/donation.email";

// Router Serves under /api/donation
const router = Router();

router.get("/getDonationUsageTypes", async (req: Request, res: Response): Promise<void> => {
    try {
        const usageTypes = [];

        const result = await getAllDonationUsageTypes();

        if (result.error) {
            throw new Error(result.error);
        }

        for (let i = 0; i < result.data!.length; i++) {
            usageTypes.push(result.data![i].title);
        }

        const donationMetersResult = await getAllDonationMeters();

        if (donationMetersResult.error) {
            throw new Error(donationMetersResult.error);
        }

        for (let i = 0; i < donationMetersResult.data!.length; i++) {
            usageTypes.push(donationMetersResult.data![i].title);
        }

        res.json({
            error: false,
            message: "Success",
            data: usageTypes,
        } as GetDonationUsageTypesApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetDonationUsageTypesApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetDonationUsageTypesApiEndpointResponse);
    }
});

router.post("/submitDonationForm", async (req: Request, res: Response): Promise<void> => {
    try {
        const { amount, firstName, lastName, email, usageType } = req.body;

        if (typeof amount !== "number" || amount <= 0) {
            throw new Error("Invalid amount. Amount must be a number greater than 0.");
        }

        if (typeof firstName !== "string" || firstName.trim() === "") {
            throw new Error("Invalid first name. First name must be a non-empty string.");
        }

        if (typeof lastName !== "string" || lastName.trim() === "") {
            throw new Error("Invalid last name. Last name must be a non-empty string.");
        }

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            throw new Error("Invalid email address. Email must be a valid email address.");
        }

        if (typeof usageType !== "string" || usageType.trim() === "") {
            throw new Error("Invalid usage type. Usage type must be a non-empty string.");
        }

        const request = await fetch(`${CONFIG.ORIGIN}/api/donation/getDonationUsageTypes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = (await request.json()) as GetDonationUsageTypesApiEndpointResponse;

        if (response.error) {
            throw new Error(response.message);
        }

        if (!response.data.includes(usageType)) {
            throw new Error("Invalid usage type. Usage type must be one of the usage types from the database.");
        }

        // Validation complete

        // Store the request in the database
        const result = await insertDonationRequest(amount, firstName, lastName, email, usageType);

        if (result.error) {
            throw new Error(result.error);
        }

        // Send an email to the admin with the details of the donation request

        const isSent = await sendDonationRequestEmail(amount, firstName, lastName, email, usageType);

        if (!isSent) {
            throw new Error(PUBLIC_CONFIG.ERROR.INTERNAL_ERROR);
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

router.get("/getDonationMeters", async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getAllDonationMeters();

        if (result.error) {
            throw new Error(result.error);
        }

        res.json({
            error: false,
            message: "Success",
            data: result.data,
        } as GetDonationMetersApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: [],
            } as GetDonationMetersApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: [],
        } as GetDonationMetersApiEndpointResponse);
    }
});

export default router;
