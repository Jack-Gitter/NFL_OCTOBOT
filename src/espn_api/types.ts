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
    
}

export type Participant = {
    athlete: {
        $ref: string
    }
    type: string
}

export type PointAfterAttempt = {
    id: number,
}
