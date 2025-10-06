export type Scoreboard = {
    leagues: unknown[]
    events: Event[]
}

export type Event = {
    id: number
}

export type Game = {
    scoringPlays: ScoringPlay[]
}

export type ScoringPlay = {
    id: number,
    scoringType: {name: "touchdown" | "fieldgoal"}
}

export type ScoringPlayInformation = {
    participants: Participant[]
    pointAfterAttempt: PointAfterAttempt
    shortText: string
    text: string
}

export type Participant = {
    athlete: {
        $ref: string
    }
    type: string
}

export type PointAfterAttempt = {
    id: number,
    value: number
}

export type Athlete = {
    firstName: string,
    lastName: string,
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

export type GameToTDPlayIds = {
    gameId: number,
    scoringPlayIds: number[]
}

export type OctopusInformation = {
    scorer: string,
    shortText: string,

}

