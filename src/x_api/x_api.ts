import { TwitterApi } from 'twitter-api-v2';

export const post = async () => {
    const url = `https://api.x.com/2/tweets`

    const userClient = new TwitterApi({
      appKey: process.env.X_API_KEY as string,
      appSecret: process.env.X_API_KEY_SECRET as string,
      accessToken: process.env.X_ACCESS_TOKEN as string,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET as string
    });

    userClient.post(url, {text: 'hi!'})
}
