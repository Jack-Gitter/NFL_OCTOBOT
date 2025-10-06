import { configDotenv } from "dotenv"
import { getAtheleteInformation, getDailyGameIds, getGameScoringPlayIds, getOctopusInformation, } from "./espn_api/espn_api"
import { AthleteAndOctopusInformation } from "./espn_api/types"
import { getTwitterClient, postOctopus } from "./x_api/x_api"

const main = async () => {
    configDotenv()
    const twitterClient = await getTwitterClient()
    const gameIds = await getDailyGameIds(new Date('09/29/2024'))
    const gameToScoringPlayIdsArray = await Promise.all(gameIds.map(async (gameId: number) => {
        return await getGameScoringPlayIds(gameId)
    }))

    await Promise.all (gameToScoringPlayIdsArray.map(async (gameToScoringPlayIds) => {
        const scoringPlayIds = gameToScoringPlayIds.scoringPlayIds
        const octopusInformationArray = await Promise.all(scoringPlayIds.map(async (scoringPlayId) => {
            return await getOctopusInformation(gameToScoringPlayIds.gameId, scoringPlayId)
        }))
        const athleteAndOctopusInformationArray = await Promise.all(octopusInformationArray.map(async (octopusInformation) => {
            if (octopusInformation) {
                const athlete = await getAtheleteInformation(octopusInformation.scorer)
                return {
                    athlete, 
                    octopusInformation
                } satisfies AthleteAndOctopusInformation
            }
        }))
        for (const athleteAndOctopusInformation of athleteAndOctopusInformationArray) {
            if (athleteAndOctopusInformation?.athlete && athleteAndOctopusInformation.octopusInformation) {
                postOctopus(twitterClient, athleteAndOctopusInformation?.octopusInformation.shortText)
            }
        }
    }))

}

main()
