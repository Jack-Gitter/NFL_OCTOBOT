export type ScoreboardResponse = {
    leagues: unknown[]
    events: EventResponse[]
}

export type EventResponse = {
    id: string
}

export type GameResponse = {
    scoringPlays: ScoringPlayResponse[]
}

export type ScoringPlayResponse = {
    id: string,
    scoringType: {name: "touchdown" | "fieldgoal"}
}

export type ScoringPlayInformationResponse = {
    id: string,
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
    id: string,
    value: number
}

export type AthleteResponse = {
    firstName: string,
    lastName: string,
    id: string,
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

