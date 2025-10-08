export type ScoreboardResponse = {
    leagues: unknown[]
    events: EventResponse[]
}

export type EventResponse = {
    id: number
}

export type GameResponse = {
    scoringPlays: ScoringPlayResponse[]
}

export type ScoringPlayResponse = {
    id: number,
    scoringType: {name: "touchdown" | "fieldgoal"}
}

export type ScoringPlayInformationResponse = {
    id: number,
    wallclock: string;
    participants: ParticipantResponse[]
    pointAfterAttempt: PointAfterAttemptResponse
    shortText: string
    text: string
    octopusScorer: AthleteResponse
}

export type ParticipantResponse = {
    athlete: {
        $ref: string
    }
    type: string
}

export type PointAfterAttemptResponse = {
    id: number,
    value: number
}

export type AthleteResponse = {
    firstName: string,
    lastName: string,
    id: number,
}

export enum SCORING_TYPE {
    TOUCHDOWN = "touchdown"
}

export enum POINT_AFTER_ATTEMPT {
    TWO_POINT_PASS = 15,
    TWO_POINT_RUSH = 16
}

export enum SCORER_TYPE {
    PAT_SCORER = "patScorer",
    TD_SCORER = "scorer"
}

