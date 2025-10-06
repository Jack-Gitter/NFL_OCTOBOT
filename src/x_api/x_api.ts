import { Client, auth } from "twitter-api-sdk";

export const initXClient = () => {
    const creds = new auth.OAuth2Bearer(process.env.X_BEARER_TOKEN ?? '')
    return new Client(creds)
}

export const post = async (client: Client, text: string) => {
    const body = {text}
    await client.tweets.createTweet(body)
}

