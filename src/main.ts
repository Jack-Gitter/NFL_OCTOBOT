import { getAtheleteInformation, getDailyGameIds, getGameScoringPlayIds, getOctopusInformation, } from "./espn_api/espn_api"
import { AthleteAndOctopusInformation } from "./espn_api/types"

const main = async () => {
    const gameIds = await getDailyGameIds(new Date('09/16/2018'))
    const gameToScoringPlayIdsArray = await Promise.all(gameIds.map(async (gameId: number) => {
        return await getGameScoringPlayIds(gameId)
    }))

    gameToScoringPlayIdsArray.map(async (gameToScoringPlayIds) => {
        const scoringPlayIds = gameToScoringPlayIds.scoringPlayIds
        const octopusInformationArray = await Promise.all(scoringPlayIds.map(async (scoringPlayId) => {
            return await getOctopusInformation(gameToScoringPlayIds.gameId, scoringPlayId)
        }))
        const athleteAndOctopusInformationArray = await Promise.all(octopusInformationArray.map(async (octoInfo) => {
            if (octoInfo) {
                const athlete = await getAtheleteInformation(octoInfo.scorer)
                return {
                    athlete, 
                    octoInfo
                } satisfies AthleteAndOctopusInformation
            }
        }))
        for (const data of athleteAndOctopusInformationArray) {
            if (data?.athlete && data.octoInfo) {
                console.log(data?.athlete.firstName)
                console.log(data?.athlete.lastName)
                console.log(data?.octoInfo.shortText)
            }
        }

    })
}

main()
