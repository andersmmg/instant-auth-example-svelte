import { init } from "@instantdb/core";
import { readable } from "svelte/store";

const APP_ID = "3d4e043e-83f3-4581-9277-7b933d50ba9f";

type Schema = {
    todos: {
        id: string;
        text: string;
        done: boolean;
    };
};

const db = init<Schema>({ appId: APP_ID });

const auth = readable({}, (set) => {
    db.subscribeAuth((result) => {
        console.log(result)
        set(result);
    });
});

export  { db, auth };