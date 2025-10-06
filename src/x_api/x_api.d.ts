import { TwitterApi } from 'twitter-api-v2';
export declare const twitterBaseUrl = "https://api.x.com/2";
export declare const getTwitterClient: () => Promise<TwitterApi>;
export declare const postOctopus: (twitterClient: TwitterApi, text: string) => Promise<void>;
//# sourceMappingURL=x_api.d.ts.map