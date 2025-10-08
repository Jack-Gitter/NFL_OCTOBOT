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
        if (this.pointAfterAttempt.isTwoPointAttempt && this.pointAfterAttempt.success && this.pointAfterAttempt.scorer) {
            const tdScorer = this.participants.find((participant: Athlete) => {
                return participant.type === SCORER_TYPE.TD_SCORER
            })
            return (tdScorer && this.pointAfterAttempt.scorer.id === tdScorer.id) 
        }
        return false
    }

    public isMissedOctopus() {
        if (this.pointAfterAttempt.isTwoPointAttempt && !this.pointAfterAttempt.success && this.pointAfterAttempt.scorer) {
            const tdScorer = this.participants.find((participant: Athlete) => {
                return participant.type === SCORER_TYPE.TD_SCORER
            })
            return (tdScorer && this.pointAfterAttempt.scorer.id === tdScorer.id) 
        }
        return false

    }

    public setOctopusScorer() {
        this.octopusScorer = this.pointAfterAttempt.scorer
    }

}
