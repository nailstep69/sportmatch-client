import { authFetch } from "./authFetch";

export async function getMyMatches() {
    const res = await authFetch("/Match/my-requests");

    if (!res.ok) throw new Error(await res.text());
    return res.json();
}