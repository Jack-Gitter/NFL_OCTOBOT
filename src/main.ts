import { getAtheleteInformation, getDailyGameIds, getGameScoringPlayIds, getOctopusInformation, } from "./espn_api/espn_api"
import { AthleteAndOctopusInformation } from "./espn_api/types"

const main = async () => {
    const gameIds = await getDailyGameIds(new Date('11/19/2017'))
    const gameToScoringPlayIdsArray = await Promise.all(gameIds.map(async (gameId: number) => {
        return await getGameScoringPlayIds(gameId)
    }))

    gameToScoringPlayIdsArray.map(async (gameToScoringPlayIds) => {
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
                console.log(athleteAndOctopusInformation?.athlete.firstName)
                console.log(athleteAndOctopusInformation?.athlete.lastName)
                console.log(athleteAndOctopusInformation?.octopusInformation.shortText)
            }
        }

    })
}

main()
