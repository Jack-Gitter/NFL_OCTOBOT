import { Participant, SCORER_TYPE, ScoringPlayInformation } from "../espn_api/types";

export class Game {
    constructor(public gameId: number, public scoringPlays?: ScoringPlayInformation[]) {}

    public deduplicateProcessedPlays(playIds: number[]) {
        const playIdsSet = new Set(playIds)
        this.scoringPlays = this.scoringPlays?.filter(scoringPlay => {
            return !playIdsSet.has(scoringPlay.id)
        })
    }

    public extractOctopusScoringPlays() {
        this.scoringPlays?.filter((scoringPlay) => {
            const isTwoPointConversion = 
                scoringPlay?.pointAfterAttempt?.value === 2 || 
                (scoringPlay?.text?.includes('TWO-POINT CONVERSION ATTEMPT') && scoringPlay?.text?.includes('ATTEMPT SUCCEEDS'))
            let patScorer = undefined
            let tdScorer = undefined 
            if (isTwoPointConversion) {
                patScorer = scoringPlay.participants.find((participant: Participant) => {
                    return participant.type === SCORER_TYPE.PAT_SCORER
                })
                tdScorer = scoringPlay.participants.find((participant: Participant) => {
                    return participant.type === SCORER_TYPE.TD_SCORER
                })
            }
            return (patScorer && tdScorer && patScorer.athlete.$ref === tdScorer.athlete.$ref) 
        })
    }
}
