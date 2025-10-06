import { Client, auth } from "twitter-api-sdk";

export const post = async (client: Client, text: string) => {
    const body = {text}
    await client.tweets.createTweet(body)
}

export const xAuthClient = new auth.OAuth2User({
 client_id: process.env.X_API_KEY as string,
 client_secret: process.env.X_SECRET_KEY as string,
 callback: "",
 scopes: [],
});

export const xClient = new Client(xAuthClient)

