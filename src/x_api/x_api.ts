import { Client, auth } from "twitter-api-sdk";

export const initXClient = () => {
    const creds = new auth.OAuth2User({
     client_id: process.env.CLIENT_ID as string,
     client_secret: process.env.CLIENT_SECRET as string,
     callback: "",
     scopes: [],
    });
    return new Client(creds)
}

export const post = async (client: Client, text: string) => {
    const body = {text}
    await client.tweets.createTweet(body)
}

