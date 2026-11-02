import { CONFIG } from "../config";
import { DelivApiFile } from "../.";

/**
 * <Function>getAllDelivApiFiles</Function>
 * 
 * Retrieves metadata for all files in the DelivAPI storage system.
 * Used to list available files from the external file storage service.
 * 
 * @returns {Promise<{error: boolean; message: string; metadata: DelivApiFile[] | null}>} An object containing `error` (true if request failed), `message` (error description or response text), and `metadata` (array of file objects or null on success). Throws an error if the API request fails.
 */
export async function getAllDelivApiFiles(): Promise<{
    error: boolean;
    message: string;
    metadata: DelivApiFile[] | null;
}> {
    const request = await fetch(CONFIG.DELIVAPI_URL + "/api/getFilesMetadata", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: CONFIG.DELIVAPI_USER,
        }),
    });

    const response = await request.json();

    return response;
}

/**
 * <Function>getMimeType</Function>
 * 
 * Retrieves the MIME type of a file from its URL.
 * Sends a HEAD request to fetch Content-Type header information.
 * Returns null if the request fails or returns an error status.
 * 
 * @param {string} url - The full URL of the file to check.
 * @returns {Promise<string | null>} The MIME type as a string if successful, null if the request failed. Throws no error; logs to console on failure.
 */
export async function getMimeType(url: string): Promise<string | null> {
    const request = await fetch(url, {
        method: "HEAD",
    });

    if (!request.ok) {
        console.error(`Failed to fetch mime type for ${url}. Status: ${request.status}`);
        return null;
    }

    const mimeType = request.headers.get("Content-Type");

    return mimeType;
}

/**
 * <Function>getActualMimeType</Function>
 * 
 * Determines the actual MIME type of a file, with special handling for JSON files.
 * If the file appears to be JSON content type, it checks the DelivAPI CDN URL instead
 * since JSON files might be chunked uploads without proper MIME headers initially.
 * 
 * @param {string} supposedMimeType - The MIME type reported by the server or known from other means.
 * @param {string} uuid - The unique identifier/UUID of the file in storage (if using DelivAPI).
 * @returns {Promise<string>} The determined MIME type string. If the type is already known and not JSON, returns it directly. If a HEAD request fails, logs an error and returns null-like behavior for JSON cases. Throws no errors.
 */
export async function getActualMimeType(supposedMimeType: string, uuid: string): Promise<string> {
    let mimeType = supposedMimeType;

    if (mimeType === "application/json") {
        // This is most likely a chunked file
        const response = await getMimeType(`${CONFIG.DELIVAPI_URL}/cdn/${CONFIG.DELIVAPI_USER}/${uuid}`);

        if (response) {
            mimeType = response;
        }
    }
    return mimeType;
}
