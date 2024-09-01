import { init, type User } from "@instantdb/core";

const APP_ID = '3d4e043e-83f3-4581-9277-7b933d50ba9f'

type Schema = {
    todos: {
        id: string;
        text: string;
        done: boolean;
    };
};

const db = init<Schema>({ appId: APP_ID });

let user: User | null = null;
let authError: string | null = null;

db.subscribeAuth((resp) => {
    if (resp.error) {
        authError = resp.error.message;
        return;
    }
    if (resp.user) {
        user = resp.user;
        authError = null;
    }
});