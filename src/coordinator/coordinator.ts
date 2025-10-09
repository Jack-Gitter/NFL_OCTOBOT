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
    const currentGameIds = await getDailyGameIds(date)

    console.log(`Fetched ${currentGameIds.length} games for today, ${date.toISOString()}`)

    const games = await Promise.all(currentGameIds.map(async (gameId: number) => {
        return getGameInformation(gameId)
    }))

    for (const game of games) {

        console.log(game)
        game.deduplicateProcessedPlays(processedPlayIds)

        const allOctopi = game.filterScoringPlays()

        allOctopi.sort((scoringPlay1, scoringPlay2) => {
            return scoringPlay1.wallclock.getTime() - scoringPlay2.wallclock.getTime()
        })

        for (const scoringPlay of allOctopi) {
            if (scoringPlay.isOctopus()) {
                scoringPlay.populateOctopusPlayerInformation()
                await scoringPlay.saveOctopusToDatabase(datasource)
                await scoringPlay.postOctopusToTwitter(twitterClient, datasource)
            } else if (scoringPlay.isMissedOctopus())  {
                scoringPlay.populateFailedOctopusPlayerInformation()
                await scoringPlay.postFailedOctopusToTwitter(twitterClient, datasource)
            }
        }
    }
}


