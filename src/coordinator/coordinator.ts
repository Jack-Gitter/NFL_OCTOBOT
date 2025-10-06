import { TwitterApi } from "twitter-api-v2"
import { ScoringPlay } from "../entities/Play"
import { Repository } from "typeorm"
import { getDailyGameIds, getGameInformation } from "../espn_api/espn_api"

const getProccessedPlayIds = async (scoringPlayRepository: Repository<ScoringPlay>) => {
    const processedOctopusPlays = await scoringPlayRepository.find()
    return processedOctopusPlays.map(checkedPlay => {
        return checkedPlay.id
    })

}
export const run = async (twitterClient: TwitterApi, scoringPlayRepository: Repository<ScoringPlay>) => {
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


