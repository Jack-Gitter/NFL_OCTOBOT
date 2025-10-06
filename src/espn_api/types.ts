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
