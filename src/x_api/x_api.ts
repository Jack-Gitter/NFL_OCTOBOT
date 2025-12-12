import { TwitterApi } from 'twitter-api-v2';
import { DonatorInformation } from '../utils';

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
    allTimeDonators: DonatorInformation[],
    monthlyDonatorName?: string,
    monthlyDonatorAmount?: number,
    totalMonthlyDonations?: number
) => {
    try {
        const text = formatDonationTweet(allTimeDonators, monthlyDonatorName, monthlyDonatorAmount, totalMonthlyDonations) 
        const body = { text }
        console.log(body)
        // await twitterClient.post(`${twitterBaseUrl}/tweets`, body)
        console.log(`Successfully posted donations tweet!`)
    } catch (error) {
        console.error(error)
    }
}

const formatDonationTweet = (
  allTimeDonators: DonatorInformation[],
  monthlyDonatorName?: string,
  monthlyDonatorAmount?: number,
  totalMonthlyDonations?: number
) => {
  let allTimeDonatorsList = 'No donations yet!'

  if (allTimeDonators.length > 0) {
	allTimeDonatorsList = allTimeDonators.map((d, index) => {
      const name = d.donatorName
      const amount = (d.total).toFixed(2);
      return `${index + 1}. '${name}' - $${amount}`;
    })
    .join('\n');
  }

  let monthlyDonatorText = 'No donations this month!';
  if (monthlyDonatorName != null && monthlyDonatorAmount != null) {
	  monthlyDonatorText = `'${monthlyDonatorName}' - $${monthlyDonatorAmount.toFixed(2)}`
  }

  const safeTotalMonthly = (totalMonthlyDonations ?? 0).toFixed(2);
  const monthsCovered = monthlyDonatorAmount ? (monthlyDonatorAmount / 15).toFixed(1) : "0";

  return `Donation Recap 💰

Top All-Time
${allTimeDonatorsList}

Top Monthly 
${monthlyDonatorText}

Monthly Impact
$${safeTotalMonthly} → keeps Octobot running ${monthsCovered} month(s)
`;
};

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
