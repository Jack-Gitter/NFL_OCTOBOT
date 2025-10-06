import datasource from "../datasource/datasource"
import { Play } from "../entities/Play"
import { getAtheleteInformation, getDailyGameIds, getGameScoringPlayIds, getOctopusInformation } from "../espn_api/espn_api"
import { AthleteAndOctopusInformation } from "../espn_api/types"
import { getTwitterClient, postOctopus } from "../x_api/x_api"

export const checkForOctopus = async () => {
    const twitterClient = await getTwitterClient()
    const gameIds = await getDailyGameIds(new Date('09/29/2024'))
    const playRepository = datasource.getRepository(Play)
    const checkedPlays = await playRepository.find()
    const checkedPlayIds = checkedPlays.map(checkedPlay => {
        return checkedPlay.id
    })
    const checkedPlayIdsSet = new Set(checkedPlayIds)
    const gameToScoringPlayIdsArray = await Promise.all(gameIds.map(async (gameId: number) => {
        return await getGameScoringPlayIds(gameId)
    }))
    gameToScoringPlayIdsArray.forEach((gameToScoringPlayIds) => {
        gameToScoringPlayIds.scoringPlayIds = gameToScoringPlayIds.scoringPlayIds.filter(scoringPlayId => {
            return !checkedPlayIdsSet.has(scoringPlayId)
        })
    })

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
        athleteAndOctopusInformationArray.map(async (athleteAndOctopusInformation) => {
            if (athleteAndOctopusInformation?.athlete && athleteAndOctopusInformation.octopusInformation) {
                const play = new Play()
                play.id = athleteAndOctopusInformation.octopusInformation.scoringPlayId
                await playRepository.save(play)
                postOctopus(twitterClient, athleteAndOctopusInformation?.octopusInformation.shortText)
            }
        })
    }))
}
