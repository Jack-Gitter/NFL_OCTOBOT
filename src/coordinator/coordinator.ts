import { TwitterApi } from "twitter-api-v2"
import { ScoringPlay } from "../entities/Play"
import { Repository } from "typeorm"
import { getDailyGameIds, getGameInformation } from "../espn_api/espn_api"
import { DataSource } from "typeorm/browser"

export const run = async (twitterClient: TwitterApi, scoringPlayRepository: Repository<ScoringPlay>, datasource: DataSource) => {

    const processedOctopusPlays = await scoringPlayRepository.find()
    const processedPlayIds = processedOctopusPlays.map(checkedPlay => {
        return checkedPlay.id
    })

    const date = new Date()
    const currentGameIds = await getDailyGameIds(new Date(date))

    console.log(`Fetched ${currentGameIds.length} games for today, ${date.toISOString()}`)

    const games = await Promise.all(currentGameIds.map(async (gameId: number) => {
        return getGameInformation(gameId)
    }))

    for (const game of games) {
        game.deduplicateProcessedPlays(processedPlayIds)
        const successfulOctopi = game.filterOctopusPlays()
        const failedOctipi = game.filterFailedOctopusPlays()
        for (const successfulOctopus of successfulOctopi) {
            successfulOctopus.populateOctopusPlayerInformation()
            await successfulOctopus.saveOctopusToDatabase(datasource)
            await successfulOctopus.postOctopusToTwitter(twitterClient, datasource)
        }
        for (const failedOctopus of failedOctipi) {
            failedOctopus.populateFailedOctopusPlayerInformation()
            await failedOctopus.postFailedOctopusToTwitter(twitterClient)
        }
    }
}


