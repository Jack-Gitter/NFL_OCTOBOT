import { TwitterApi } from 'twitter-api-v2';

export const twitterBaseUrl = `https://api.x.com/2/`

export const getTwitterClient = async () => {
    const twitterClient = new TwitterApi({
      appKey: process.env.X_API_KEY as string,
      appSecret: process.env.X_API_KEY_SECRET as string,
      accessToken: process.env.X_ACCESS_TOKEN as string,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET as string
    });
}

export const postOctopus = async (twitterClient: TwitterApi, text: string) => {
    const body = { text }
    twitterClient.post(`${twitterBaseUrl}/tweets`, body)

}
