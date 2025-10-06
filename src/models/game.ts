import { getAtheleteInformation } from "../espn_api/espn_api";
import { Participant, SCORER_TYPE, ScoringPlayInformation } from "../espn_api/types";

export class Game {
    constructor(public gameId: number, public scoringPlays?: ScoringPlayInformation[]) {}

    public deduplicateProcessedPlays(playIds: number[]) {
        const playIdsSet = new Set(playIds)
        this.scoringPlays = this.scoringPlays?.filter(scoringPlay => {
            return !playIdsSet.has(scoringPlay.id)
        })
    }

    public filterScoringPlays() {
        this.scoringPlays?.filter((scoringPlay) => {
            const isTwoPointConversion = 
                scoringPlay?.pointAfterAttempt?.value === 2 || 
                (scoringPlay?.text?.includes('TWO-POINT CONVERSION ATTEMPT') && scoringPlay?.text?.includes('ATTEMPT SUCCEEDS'))

            if (isTwoPointConversion) {
                const patScorer = scoringPlay.participants.find((participant: Participant) => {
                    return participant.type === SCORER_TYPE.PAT_SCORER
                })
                const tdScorer = scoringPlay.participants.find((participant: Participant) => {
                    return participant.type === SCORER_TYPE.TD_SCORER
                })
                return (patScorer && tdScorer && patScorer.athlete.$ref === tdScorer.athlete.$ref) 
            }
            return false
        })
    }

    public async getOctopusPlayerInformation() {
        this.scoringPlays?.map(async (scoringPlay) => {
            const patScorer = scoringPlay.participants.find((participant: Participant) => {
                return participant.type === SCORER_TYPE.PAT_SCORER
            })
            if (patScorer) {
                scoringPlay.octopusScorer = await getAtheleteInformation(patScorer?.athlete.$ref)
            }
            return scoringPlay
        })
    }
}
