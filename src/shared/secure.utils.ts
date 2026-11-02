import { randomBytes, randomInt } from "node:crypto";

/**
 * <Function>getSecureMFACode</Function>
 * 
 * Generates a secure multi-factor authentication (MFA) code for login verification or other 2FA purposes.
 * Uses cryptographically secure random number generator to create numeric codes of configurable length.
 * Default length is 6 digits (common TOTP/HOTP format). Each digit is randomly selected from 0-9.
 * Returns concatenated string without dashes or spaces, suitable for SMS/email/OTP token display.
 * 
 * @param {number} length - Number of random digits to generate in the MFA code (default: 6). Minimum practical value is 4, maximum typically 8.
 * @returns {string} A randomly generated numeric string containing only digits 0-9 with the specified number of characters. Suitable for email/SMS/OTP input forms expecting numeric codes.
 */
export function getSecureMFACode(length: number = 6): string {
    let code = "";

    for (let i = 0; i < length; i++) {
        code += randomInt(0, 10).toString();
    }

    return code;
}

/**
 * <Function>getSecureHexString</Function>
 * 
 * Generates a secure hexadecimal string for use as temporary tokens, IDs, or unique identifiers.
 * Uses Node.js crypto.randomBytes which provides cryptographically strong random values suitable for security-sensitive applications.
 * Useful for generating newsletter signup tokens, password reset codes, invitation links, or any short-lived unique identifier needing unpredictability.
 * 
 * @param {number} length - Number of hex characters to generate in the output string (default: 5). Controls entropy and uniqueness probability - longer strings are less collision-prone.
 * @returns {string} A randomly generated hexadecimal string containing lowercase a-f digits with no separators, matching requested character count. Suitable for URL parameters, token values, or temporary IDs.
 */
export function getSecureHexString(length: number = 5): string {
    const code = randomBytes(length).toString("hex");

    return code;
}
