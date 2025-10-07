import { TwitterApi } from 'twitter-api-v2';

export const twitterBaseUrl = `https://api.x.com/2`

export const getTwitterClient = async () => {
    return new TwitterApi({
      appKey: process.env.X_API_KEY as string,
      appSecret: process.env.X_API_KEY_SECRET as string,
      accessToken: process.env.X_ACCESS_TOKEN as string,
      accessSecret: process.env.X_ACCESS_TOKEN_SECRET as string
    });
}

export const postOctopusToTwitter = async (
    twitterClient: TwitterApi, 
    playSummary: string, 
    playerFirstName: string, 
    playerLastName: string, 
    playerOctopusCount: number, 
    globalOctopusCount: number
) => {
    try {
        const text = formatOctopusTweet(playSummary, playerFirstName, playerLastName, playerOctopusCount, globalOctopusCount)
        const body = { text }
        //await twitterClient.post(`${twitterBaseUrl}/tweets`, body)
        console.log(`Successfully posted octopus to twitter for player ${playerFirstName} ${playerLastName}`)
    } catch (error) {
        console.error(error)
    }
}

export const formatOctopusTweet = (playSummary: string, playerFirstName: string, playerLastName: string, playerOctopusCount: number, globalOctopusCount: number) => {

    return `OCTOPUS ✅ 

${playSummary}

This is ${playerFirstName} ${playerLastName}'s ${ordinalSuffixOf(playerOctopusCount)} ever Octopus! (Since the 2025/26 Season) 

This is the NFL's ${ordinalSuffixOf(globalOctopusCount)} ever Octopus!`

}


function ordinalSuffixOf(i: number) {
    const j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}
