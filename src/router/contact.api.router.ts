import { Request, Response, Router } from "express";
import { randomBytes } from "node:crypto";
import { PUBLIC_CONFIG } from "../publicConfig";
import { CONFIG } from "../config";
import { ApiEndpointResponse, ContactConfirmRequest, GetContactRequestVerificationTokenApiEndpointResponse } from "..";
import { sendContactRequest, sendContactRequestConfirmation } from "../shared/contact.email";

// Router Serves under /api/contact
const router = Router();

const GLOBAL_contactConfirmRequests: ContactConfirmRequest[] = [];
const GLOBAL_clearOutdatedRequestsInterval = setInterval(
    (): void => {
        for (let i = 0; i < GLOBAL_contactConfirmRequests.length; i++) {
            if (Date.now() - GLOBAL_contactConfirmRequests[0].timestamp > 60 * 60 * 1000) {
                GLOBAL_contactConfirmRequests.shift();
            }
        }
    },
    60 * 60 * 1000,
); // Every Hour

router.post("/getVerificationToken", async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, message } = req.body;

        if (typeof firstName !== "string" || firstName.trim() === "") {
            throw new Error("Invalid parameter 'firstName'.");
        }

        if (typeof lastName !== "string" || lastName.trim() === "") {
            throw new Error("Invalid parameter 'lastName'.");
        }

        if (typeof email !== "string" || email.trim() === "" || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}$/.test(email)) {
            throw new Error("Invalid parameter 'email'.");
        }

        if (typeof message !== "string" || message.trim() === "") {
            throw new Error("Invalid parameter 'message'.");
        }

        // Set up a confirm request

        const code = randomBytes(5).toString("hex");
        const token = randomBytes(32).toString("hex");

        GLOBAL_contactConfirmRequests.push({
            token,
            verificationCode: code,
            timestamp: Date.now(),
            payload: {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                message: message.trim(),
            },
        });

        const sentSuccessfully = await sendContactRequestConfirmation(firstName, lastName, email, code);

        if (!sentSuccessfully) {
            // Remove the request if the email could not be sent
            const requestIndex = GLOBAL_contactConfirmRequests.findIndex((request) => request.token === token);

            if (requestIndex !== -1) {
                GLOBAL_contactConfirmRequests.splice(requestIndex, 1);
            }

            throw new Error("Failed to send verification email.");
        }

        res.json({
            error: false,
            message: "Success",
            data: {
                token,
            },
        } as GetContactRequestVerificationTokenApiEndpointResponse);
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
                data: null,
            } as GetContactRequestVerificationTokenApiEndpointResponse);

            return;
        }

        res.status(501).json({
            error: true,
            message: PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
            data: null,
        } as GetContactRequestVerificationTokenApiEndpointResponse);
    }
});

router.post("/confirmVerificationToken", async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, verificationCode } = req.body;

        if (typeof token !== "string" || token.trim() === "" || !/^[a-z0-9]{64}$/.test(token.toLowerCase())) {
            throw new Error("Invalid or missing parameter 'token'.");
        }

        if (typeof verificationCode !== "string" || verificationCode.trim() === "" || !/^[a-z0-9]{10}$/.test(verificationCode.toLowerCase())) {
            throw new Error("Invalid or missing parameter 'verificationCode'.");
        }

        const contactRequest = GLOBAL_contactConfirmRequests.find((request) => request.token === token);

        if (!contactRequest) {
            throw new Error("Invalid or expired token.");
        }

        if (contactRequest.verificationCode !== verificationCode) {
            throw new Error("Invalid verification code.");
        }

        // Request is confirmed, send the message

        const sentSuccessfully = await sendContactRequest(contactRequest.payload.email, contactRequest.payload.firstName, contactRequest.payload.lastName, contactRequest.payload.message);

        res.json({
            error: !sentSuccessfully,
            message: sentSuccessfully ? "Success" : PUBLIC_CONFIG.ERROR.INTERNAL_ERROR,
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
