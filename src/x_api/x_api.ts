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

export const postFailedOctopusToTwitter = async (
    twitterClient: TwitterApi, 
    playSummary: string, 
    playerFirstName: string, 
    playerLastName: string, 
    octopusCount: number
) => {
    try {
        const text = formatFailedOctopusTweet(playSummary, octopusCount)
        const body = { text }
        console.log(body)
        // await twitterClient.post(`${twitterBaseUrl}/tweets`, body)
        console.log(`Successfully posted failed octopus to twitter for player ${playerFirstName} ${playerLastName}`)
    } catch (error) {
        console.error(error)
    }
}
export const formatFailedOctopusTweet = (
    playSummary: string, 
    octopusCount: number
) => {
    return `UNFINISHED OCTOPUS ❌

${playSummary}

This would have been the NFL's ${ordinalSuffixOf(octopusCount)} octopus
`

}
export const postOctopusToTwitter = async (
    twitterClient: TwitterApi, 
    playSummary: string, 
    playerFirstName: string, 
    playerLastName: string, 
    playerOctopusCount: number, 
    globalOctopusCount: number,
    playerOctopusRanking: number,
    playerOctopusRankingTiedWith: number
) => {
    try {
        const text = formatOctopusTweet(playSummary, playerLastName, playerOctopusCount, globalOctopusCount, playerOctopusRanking, playerOctopusRankingTiedWith) 
        const body = { text }
        console.log(body)
        // await twitterClient.post(`${twitterBaseUrl}/tweets`, body)
        console.log(`Successfully posted octopus to twitter for player ${playerFirstName} ${playerLastName}`)
    } catch (error) {
        console.error(error)
    }
}


export const formatOctopusTweet = (
    playSummary: string, 
    playerLastName: string, 
    playerOctopusCount: number, 
    globalOctopusCount: number, 
    playerOctopusRanking: number,
    playerOctopusRankingTiedWith: number
) => {

    return `OCTOPUS ✅ 

${playSummary}

This is ${playerLastName}'s ${ordinalSuffixOf(playerOctopusCount)} octopus! 

${playerLastName} is ranked ${ordinalSuffixOf(playerOctopusRanking)}, tied with ${playerOctopusRankingTiedWith} others!

This is the NFL's ${ordinalSuffixOf(globalOctopusCount)} all time octopus!
`
}


export const tweetDonations = async (
    twitterClient: TwitterApi,
    allTimeDonatorName: string,
    allTimeDonatorAmount: number,
    monthlyDonatorName: string,
    monthlyDonatorAmount: number,
    totalMonthlyDonations: number
) => {
    try {
        const text = formatDonationTweet(allTimeDonatorName, allTimeDonatorAmount, monthlyDonatorName, monthlyDonatorAmount, totalMonthlyDonations) 
        const body = { text }
        console.log(body)
        // await twitterClient.post(`${twitterBaseUrl}/tweets`, body)
        console.log(`Successfully posted donations tweet!`)
    } catch (error) {
        console.error(error)
    }
}

const formatDonationTweet = (
    allTimeDonatorName: string,
    allTimeDonatorAmount: number,
    monthlyDonatorName: string,
    monthlyDonatorAmount: number,
    totalMonthlyDonations: number
) => {

    return `Donation Recap 💰

Highest all time donator: ${allTimeDonatorName} with $${allTimeDonatorAmount}

Highest monthly donator: ${monthlyDonatorName} with ${monthlyDonatorAmount}

Monthly donations: ${totalMonthlyDonations} keeps octobot running for ${monthlyDonatorAmount/15} months
`
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
