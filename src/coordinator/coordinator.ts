import { TwitterApi } from "twitter-api-v2"
import { ScoringPlay } from "../entities/Play"
import { Repository } from "typeorm"
import { getDailyGameIds, getGameInformation } from "../espn_api/espn_api"
import { Game } from "../models/game"

const getProccessedPlayIds = async (scoringPlayRepository: Repository<ScoringPlay>) => {
    const processedOctopusPlays = await scoringPlayRepository.find()
    return processedOctopusPlays.map(checkedPlay => {
        return checkedPlay.id
    })

}
export const run = async (twitterClient: TwitterApi, scoringPlayRepository: Repository<ScoringPlay>) => {
    const processedPlayIds = await getProccessedPlayIds(scoringPlayRepository)
    const currentGameIds = await getDailyGameIds(new Date('01/16/2021'))

    const games = await Promise.all(currentGameIds.map(async (gameId: number) => {
        return getGameInformation(gameId)
    }))

    await Promise.all(games.map(async (game: Game) => {
        game.deduplicateProcessedPlays(processedPlayIds)
        game.filterScoringPlays()
        await game.populateOctopusPlayerInformation()
        await game.saveOctopiToDatabase(scoringPlayRepository)
        await game.postOctopiToTwitter(twitterClient)
    }))
}


