import { TwitterApi } from "twitter-api-v2";
import { ScoringPlay } from "../entities/Play";
import { ScoringPlayInformation } from "./scoringPlay";
import { postOctopusToTwitter } from "../x_api/x_api";
import { DataSource, Equal, MoreThan } from "typeorm";
import { OctopusCount } from "../entities/OctopusCount";
import { PlayerOctopusCount } from "../entities/PlayerOctopusCount";

export class Game {
    constructor(public gameId: number, public scoringPlays: ScoringPlayInformation[] = []) {}

    public deduplicateProcessedPlays(playIds: number[]) {
        const gameScoringPlays = this.scoringPlays?.length
        const playIdsSet = new Set(playIds)
        this.scoringPlays = this.scoringPlays?.filter(scoringPlay => {
            return !playIdsSet.has(scoringPlay.id)
        })
        const unprocessedGameScoringPlays = this.scoringPlays.length
        console.log(
            `Filtered ${gameScoringPlays - unprocessedGameScoringPlays} scoring plays
             from game ${this.gameId} as they have been processed already`
        )

    }

    public filterOctopusPlays() {
        const successfulOctopi = this.scoringPlays?.filter((scoringPlay) => {
            return scoringPlay.isOctopus()
        })
        console.log(`Found ${this.scoringPlays.length} new octopus plays`)
        return successfulOctopi
    }

    public async filterFailedOctopusPlays() {
        const failedOctopi = this.scoringPlays?.filter((scoringPlay) => {
            return scoringPlay.isMissedOctopus()
        })
        console.log(`Found ${this.scoringPlays.length} new failed octopus plays`)
        return failedOctopi

    }

    // move this to the scoring play class?
    public async populateOctopusPlayerInformation() {
        this.scoringPlays.forEach((scoringPlay) => {
            scoringPlay.setOctopusScorer()
        })
    }

    // move this to the scoring play class?
    public async saveOctopiToDatabase(datasource: DataSource) {
        await datasource.transaction(async (entityManager) => {
            const scoringPlayRepository = entityManager.getRepository(ScoringPlay)
            const octopusCountRepository = entityManager.getRepository(OctopusCount)
            const playerOctopusCountRepository = entityManager.getRepository(PlayerOctopusCount)
            await Promise.all(this.scoringPlays?.map(async (scoringPlay) => {
                if (scoringPlay.octopusScorer) {
                    const playerId = scoringPlay.octopusScorer?.id
                    const play = new ScoringPlay(scoringPlay.id)
                    await scoringPlayRepository.save(play)
                    await octopusCountRepository.increment({id: 1}, 'count', 1)
                    const playerOctopusCount = await playerOctopusCountRepository.findOneBy({id: playerId})
                    if (!playerOctopusCount) {
                        const newPlayerOctopusCount = new PlayerOctopusCount(playerId, 1)
                        await playerOctopusCountRepository.save(newPlayerOctopusCount)
                    } else {
                        playerOctopusCount.octopusCount += 1
                        await playerOctopusCountRepository.save(playerOctopusCount)
                    }
                    console.log(`Successfully saved the playId ${scoringPlay.id}`)
                    console.log(`Successfully updated player octopus count for player with id ${playerId}`)
                    console.log(`Successfully updated global octopus count`)
                }
            }))
        })
    }


    public async postOctopiToTwitter(twitterClient: TwitterApi, datasource: DataSource) {
        for (const scoringPlay of this.scoringPlays) {
            let playerOctopusCount = 0
            let globalOctopusCount = 0
            let playerOctopusRanking = 0
            let playerOctopusRankingTiedWith = 0
            await datasource.transaction(async (entityManager) => {
                if (scoringPlay.octopusScorer)  {
                    const playerOctopusCountRepository = entityManager.getRepository(PlayerOctopusCount)
                    const octopusCountRepository = entityManager.getRepository(OctopusCount)

                    const octopusCount = await octopusCountRepository.findOneBy({id: 1})
                    const playerOctopus = await playerOctopusCountRepository.findOneBy({id: scoringPlay.octopusScorer.id})

                    if (playerOctopus && octopusCount) {
                        globalOctopusCount = octopusCount.count
                        playerOctopusCount = playerOctopus.octopusCount
                        playerOctopusRanking = await playerOctopusCountRepository.count({where: {octopusCount: MoreThan(playerOctopusCount)}}) + 1
                        playerOctopusRankingTiedWith = await playerOctopusCountRepository.count({where: {octopusCount: Equal(playerOctopusCount)}}) - 1
                    }

                }
            })

            if (scoringPlay.octopusScorer) {
                return await postOctopusToTwitter(
                    twitterClient, 
                    scoringPlay.shortText,
                    scoringPlay.octopusScorer?.firstName, 
                    scoringPlay.octopusScorer?.lastName, 
                    playerOctopusCount, 
                    globalOctopusCount,
                    playerOctopusRanking,
                    playerOctopusRankingTiedWith
                )
            }
        }
    }
}
