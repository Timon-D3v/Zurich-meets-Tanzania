import { Request, Response, Router } from "express";
import { getUserWithEmail } from "../shared/auth.database";
import { PrivateUser, PublicUser } from "..";
import bcrypt from "bcryptjs";
import { isLoggedIn } from "../middleware/auth.middleware";

// Router Serves under /api/auth
const router = Router();

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
            throw new Error(user.error as string);
        }

        if (user.data.length === 0) {
            // This is a error that could happen in the frontend
            // That means that we do not want a status of 501 and a readable error message
            res.json({
                error: true,
                message: `Es wurde kein Account mit der E-Mail '${email}' gefunden.`,
            });
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
            });
            return;
        }

        req.session.isLoggedIn = true;
        req.session.user = data;

        res.json({
            error: false,
            message: `Erfolgreich eingeloggt mit E-Mail '${email}'.`,
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            });

            return;
        }

        res.status(501).json({
            error: true,
            message: "501: Internal Server Error",
        });
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
            });

            return;
        }

        res.json({
            error: false,
            message: "Success",
            data: {
                isLoggedIn: false,
                user: null,
            },
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            });

            return;
        }

        res.status(501).json({
            error: true,
            message: "501: Internal Server Error",
        });
    }
});

router.post("/logout", (req: Request, res: Response) => {
    try {
        req.session.isLoggedIn = false;
        req.session.user = null;

        res.json({
            error: false,
            message: "Erfolgreich ausgeloggt.",
        });
    } catch (error) {
        console.error(error);

        if (error instanceof Error) {
            res.json({
                error: true,
                message: error.message,
            });

            return;
        }

        res.status(501).json({
            error: true,
            message: "501: Internal Server Error",
        });
    }
});

export default router;
