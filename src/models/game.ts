import { TwitterApi } from "twitter-api-v2";
import { ScoringPlay } from "../entities/Play";
import { Repository } from "typeorm";
import { ScoringPlayInformation } from "./scoringPlay";
import { postOctopusToTwitter } from "../x_api/x_api";

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

    public async saveOctopiToDatabase(scoringPlayRepository: Repository<ScoringPlay>) {
        // start a transaction and increase the count of the global octopus and player octopus at the same time that we save to db I think is the best option
        await Promise.all(this.scoringPlays?.map(async (scoringPlay) => {
            const play = new ScoringPlay()
            play.id = scoringPlay.id
            return await scoringPlayRepository.save(play)
        }))
    }


    public async postOctopiToTwitter(twitterClient: TwitterApi) {
        await Promise.all(this.scoringPlays.map(async (scoringPlay) => {
            console.log(scoringPlay?.octopusScorer?.firstName)
            console.log(scoringPlay?.octopusScorer?.lastName)
            // return await postOctopusToTwitter(twitterClient, scoringPlay.shortText)
        }))
    }
}
