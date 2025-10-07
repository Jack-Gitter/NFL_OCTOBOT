import { TwitterApi } from "twitter-api-v2";
import { ScoringPlay } from "../entities/Play";
import { ScoringPlayInformation } from "./scoringPlay";
import { postOctopusToTwitter } from "../x_api/x_api";
import { DataSource } from "typeorm/browser";
import { OctopusCount } from "../entities/OctopusCount";
import { PlayerOctopusCount } from "../entities/PlayerOctopusCount";
import { shorten } from "typeorm/util/StringUtils.js";

export class Game {
    constructor(public gameId: number, public scoringPlays: ScoringPlayInformation[] = []) {}

    public deduplicateProcessedPlays(playIds: number[]) {
        const playIdsSet = new Set(playIds)
        this.scoringPlays = this.scoringPlays?.filter(scoringPlay => {
            return !playIdsSet.has(scoringPlay.id)
        })
    }

    public filterScoringPlays() {
        this.scoringPlays = this.scoringPlays?.filter((scoringPlay) => {
            return scoringPlay.isOctopus()
        })
    }

    public async populateOctopusPlayerInformation() {
        this.scoringPlays.forEach((scoringPlay) => {
            scoringPlay.setOctopusScorer()
        })
    }

    public async saveOctopiToDatabase(datasource: DataSource) {
        await datasource.transaction(async (entityManager) => {
            const scoringPlayRepository = entityManager.getRepository(ScoringPlay)
            const octopusCountRepository = entityManager.getRepository(OctopusCount)
            const playerOctopusCountRepository = entityManager.getRepository(PlayerOctopusCount)
            await Promise.all(this.scoringPlays?.map(async (scoringPlay) => {
                if (scoringPlay.octopusScorer) {
                    console.log('saving!')
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
                }
            }))
        })
    }


    public async postOctopiToTwitter(twitterClient: TwitterApi, datasource: DataSource) {
        await Promise.all(this.scoringPlays.map(async (scoringPlay) => {
            let playerOctopusCount = 0
            let globalOctopusCount = 0
            await datasource.transaction(async (entityManager) => {
                if (scoringPlay.octopusScorer)  {
                    const playerOctopusCountRepository = entityManager.getRepository(PlayerOctopusCount)
                    const octopusCountRepository = entityManager.getRepository(OctopusCount)

                    const octopusCount = await octopusCountRepository.findOneBy({id: 1})
                    const playerOctopus = await playerOctopusCountRepository.findOneBy({id: scoringPlay.octopusScorer.id})

                    if (playerOctopus && octopusCount) {
                        globalOctopusCount = octopusCount.count
                        playerOctopusCount = playerOctopus.octopusCount
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
                    globalOctopusCount
                )
            }
        }))
    }
}
