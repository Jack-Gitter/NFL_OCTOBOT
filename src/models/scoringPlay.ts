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

}
