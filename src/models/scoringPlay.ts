import { SCORER_TYPE } from "../espn_api/types";
import { Athlete } from "./athlete";
import { PointAfterAttempt } from "./pointAfterAttempt";

export class ScoringPlayInformation {
    constructor(
        public id: number,
        public participants: Athlete[],
        public pointAfterAttempt: PointAfterAttempt,
        public shortText: string,
        public text: string,
        public octopusScorer?: Athlete
    ) {}

    public isOctopus() {
        if (this.pointAfterAttempt.isTwoPointAttempt && this.pointAfterAttempt.success) {
                const patScorer = this.participants.find((participant: Athlete) => {
                    return participant.type === SCORER_TYPE.PAT_SCORER
                })
                const tdScorer = this.participants.find((participant: Athlete) => {
                    return participant.type === SCORER_TYPE.TD_SCORER
                })
                return (patScorer && tdScorer && patScorer.id === tdScorer.id) 
            }
            return false
    }

    public setOctopusScorer() {
        const patScorer = scoringPlay.participants.find((participant: ParticipantResponse) => {
            return participant.type === SCORER_TYPE.PAT_SCORER
        })
        if (patScorer) {
            scoringPlay.octopusScorer = await getAtheleteInformation(patScorer?.athlete.$ref)
        }
        return scoringPlay
    }

}
