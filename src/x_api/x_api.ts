import { Client, auth } from "twitter-api-sdk";

const initXClient = () => {
    return new auth.OAuth2User({
        client_id: process.env.CLIENT_ID as string,
        client_secret: process.env.CLIENT_SECRET as string,
        callback: "YOUR-CALLBACK",
        scopes: ["tweet.read", "users.read", "offline.access"]
    })
}
