import { TwitterApi } from "twitter-api-v2";
import { ScoringPlay } from "../entities/Play";
import { Repository } from "typeorm";
import { ScoringPlayInformation } from "./scoringPlay";
import { postOctopusToTwitter } from "../x_api/x_api";
import { DataSource } from "typeorm/browser";
import { OctopusCount } from "../entities/OctopusCount";
import { PlayerOctopusCount } from "../entities/PlayerOctopusCount";

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

    public async saveOctopiToDatabase(datasource: DataSource, playerId: number) {
        await datasource.transaction(async (entityManager) => {
            const scoringPlayRepository = entityManager.getRepository(ScoringPlay)
            const octopusCountRepository = entityManager.getRepository(OctopusCount)
            const playerOctopusCountRepository = entityManager.getRepository(PlayerOctopusCount)
            await Promise.all(this.scoringPlays?.map(async (scoringPlay) => {
                const play = new ScoringPlay(scoringPlay.id)
                await scoringPlayRepository.save(play)
                await octopusCountRepository.increment({id: 1}, 'count', 1)
                const playerOctopusCount = await playerOctopusCountRepository.findOneBy({id: playerId})
                if (!playerOctopusCount) {
                    const newPlayerOctopusCount = new PlayerOctopusCount(playerId)
                    await playerOctopusCountRepository.save(newPlayerOctopusCount)
                } else {
                    playerOctopusCount.octopusCount += 1
                    await playerOctopusCountRepository.save(playerOctopusCount)
                }
            }))

        })
    }


    public async postOctopiToTwitter(twitterClient: TwitterApi) {
        await Promise.all(this.scoringPlays.map(async (scoringPlay) => {
            console.log(scoringPlay?.octopusScorer?.firstName)
            console.log(scoringPlay?.octopusScorer?.lastName)
            // return await postOctopusToTwitter(twitterClient, scoringPlay.shortText)
        }))
    }
}
