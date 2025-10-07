import { AthleteResponse, ParticipantResponse, PointAfterAttemptResponse } from "../espn_api/types";
import { Athlete } from "./athlete";

export class ScoringPlay {
    constructor(
        public id: number,
        public participants: Athlete[],
        public pointAfterAttempt: PointAfterAttemptResponse,
        public shortText: string,
        public text: string,
        public octopusScorer: Athlete
    ) {}
}
