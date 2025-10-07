import { TwitterApi } from "twitter-api-v2";
import { getAtheleteInformation } from "../espn_api/espn_api";
import { ParticipantResponse, SCORER_TYPE, ScoringPlayInformation } from "../espn_api/types";
import { postOctopusToTwitter } from "../x_api/x_api";
import { ScoringPlay } from "../entities/Play";
import { Repository } from "typeorm";

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
            const isTwoPointConversion = 
                scoringPlay?.pointAfterAttempt?.value === 2 || 
                (scoringPlay?.text?.includes('TWO-POINT CONVERSION ATTEMPT') && scoringPlay?.text?.includes('ATTEMPT SUCCEEDS'))

            if (isTwoPointConversion) {
                const patScorer = scoringPlay.participants.find((participant: ParticipantResponse) => {
                    return participant.type === SCORER_TYPE.PAT_SCORER
                })
                const tdScorer = scoringPlay.participants.find((participant: ParticipantResponse) => {
                    return participant.type === SCORER_TYPE.TD_SCORER
                })
                return (patScorer && tdScorer && patScorer.athlete.$ref === tdScorer.athlete.$ref) 
            }
            return false
        })
    }

    public async populateOctopusPlayerInformation() {
        this.scoringPlays?.map(async (scoringPlay) => {
            const patScorer = scoringPlay.participants.find((participant: ParticipantResponse) => {
                return participant.type === SCORER_TYPE.PAT_SCORER
            })
            if (patScorer) {
                scoringPlay.octopusScorer = await getAtheleteInformation(patScorer?.athlete.$ref)
            }
            return scoringPlay
        })
    }

    public async saveOctopiToDatabase(scoringPlayRepository: Repository<ScoringPlay>) {
        await Promise.all(this.scoringPlays?.map(async (scoringPlay) => {
            const play = new ScoringPlay()
            play.id = scoringPlay.id
            return await scoringPlayRepository.save(play)
        }))
    }

    public async postOctopiToTwitter(twitterClient: TwitterApi) {
        await Promise.all(this.scoringPlays.map(async (scoringPlay) => {
            console.log(scoringPlay)
            console.log(scoringPlay.octopusScorer.firstName)
            console.log(scoringPlay.octopusScorer.lastName)
            return []
            //await postOctopusToTwitter(twitterClient, scoringPlay.shortText)
        }))
    }
}
