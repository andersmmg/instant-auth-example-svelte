import { db } from "$lib/data";
import { type User } from "@instantdb/core";

export const ssr = false;

let user: User | null = null;
let authError: string | null = null;

export function load() {
    db.subscribeAuth((resp) => {
        if (resp.error) {
            authError = resp.error.message;
            return { user, authError };
        }
        if (resp.user) {
            user = resp.user;
            authError = null;
            return { user, authError };
        }
    });

    return { user, authError };
}
