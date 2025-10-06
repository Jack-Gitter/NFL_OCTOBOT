import { TwitterApi } from "twitter-api-v2"
import { ScoringPlay } from "../entities/Play"
import { getAtheleteInformation, getDailyGameIds, getGameInformation, getGameScoringPlayIds, getOctopusInformation } from "../espn_api/espn_api"
import { AthleteAndOctopusInformation } from "../espn_api/types"
import { postOctopusToTwitter } from "../x_api/x_api"
import { Repository } from "typeorm"

const getProccessedPlayIds = async (scoringPlayRepository: Repository<ScoringPlay>) => {
    const processedOctopusPlays = await scoringPlayRepository.find()
    return processedOctopusPlays.map(checkedPlay => {
        return checkedPlay.id
    })

}
export const run2 = async(twitterClient: TwitterApi, scoringPlayRepository: Repository<ScoringPlay>) => {
    const processedPlayIds = await getProccessedPlayIds(scoringPlayRepository)
    const currentGameIds = await getDailyGameIds()

    const games = await Promise.all(currentGameIds.map(async (gameId) => {
        return getGameInformation(gameId)
    }))

    for (const game of games) {
        game.deduplicateProcessedPlays(processedPlayIds)
        game.filterScoringPlays()
        await game.populateOctopusPlayerInformation()
        await game.saveOctopiToDatabase(scoringPlayRepository)
        await game.postOctopiToTwitter(twitterClient)
    }
}

export const run = async (twitterClient: TwitterApi, scoringPlayRepository: Repository<ScoringPlay>) => {

    /*const processedOctopusPlays = await scoringPlayRepository.find()
    const proccessedOctopusPlayIds = processedOctopusPlays.map(checkedPlay => {
        return checkedPlay.id
    })
    const processedOctopusPlayIdsSet = new Set(proccessedOctopusPlayIds)*/

    //const gameIds = await getDailyGameIds()
    const gameToScoringPlayIdsArray = await Promise.all(gameIds.map(async (gameId: number) => {
        return await getGameScoringPlayIds(gameId)
    }))
    gameToScoringPlayIdsArray.forEach((gameToScoringPlayIds) => {
        gameToScoringPlayIds.scoringPlayIds = gameToScoringPlayIds.scoringPlayIds.filter(scoringPlayId => {
            return !processedOctopusPlayIdsSet.has(scoringPlayId)
        })
    })

    await Promise.all(gameToScoringPlayIdsArray.map(async (gameToScoringPlayIds) => {
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

        await Promise.all(athleteAndOctopusInformationArray.map(async (athleteAndOctopusInformation) => {
            if (athleteAndOctopusInformation?.athlete && athleteAndOctopusInformation.octopusInformation) {
                const play = new ScoringPlay()
                play.id = athleteAndOctopusInformation.octopusInformation.scoringPlayId
                await scoringPlayRepository.save(play)
                await postOctopusToTwitter(twitterClient, athleteAndOctopusInformation?.octopusInformation.shortText)
            }
        }))

    }))
}

