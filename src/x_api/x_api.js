"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postOctopus = exports.getTwitterClient = exports.twitterBaseUrl = void 0;
const twitter_api_v2_1 = require("twitter-api-v2");
exports.twitterBaseUrl = `https://api.x.com/2`;
const getTwitterClient = async () => {
    return new twitter_api_v2_1.TwitterApi({
        appKey: process.env.X_API_KEY,
        appSecret: process.env.X_API_KEY_SECRET,
        accessToken: process.env.X_ACCESS_TOKEN,
        accessSecret: process.env.X_ACCESS_TOKEN_SECRET
    });
};
exports.getTwitterClient = getTwitterClient;
const postOctopus = async (twitterClient, text) => {
    try {
        const body = { text };
        await twitterClient.post(`${exports.twitterBaseUrl}/tweets`, body);
    }
    catch (error) {
        console.error(error);
    }
};
exports.postOctopus = postOctopus;
//# sourceMappingURL=x_api.js.map