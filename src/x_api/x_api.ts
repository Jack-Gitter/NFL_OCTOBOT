import { Client, auth } from "twitter-api-sdk";

export const initXClient = () => {
    const creds = new auth.OAuth2Bearer(process.env.X_BEARER_TOKEN ?? '')
    return new Client(creds)
}

