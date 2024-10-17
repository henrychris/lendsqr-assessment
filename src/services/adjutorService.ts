import { KARMA_URL } from "../common/adjutorApi";

export async function checkBlacklist(email: string) {
    const response = await fetch(`${KARMA_URL}${email}`, {
        headers: { Authorization: `Bearer ${process.env.APP_KEY}` },
    });

    if (response.status === 404) {
        console.log("Email not found in blacklist.");
        return null;
    }

    if (!response.ok) {
        console.error("Failed to check blacklist:", response.statusText);
        throw new Error("Error checking blacklist.");
    }

    return await response.json();
}
