import { randomBytes, randomInt } from "node:crypto";

export function getSecureMFACode(length: number = 6): string {
    let code = "";

    for (let i = 0; i < length; i++) {
        code += randomInt(0, 10).toString();
    }

    return code;
}

export function getSecureHexString(length: number = 5): string {
    const code = randomBytes(length).toString("hex");

    return code;
}
