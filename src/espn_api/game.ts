import { ScoringPlay } from "./types";

export class Game {
    constructor(public gameId: string, public scoringPlays: ScoringPlay[]) {}

    public deduplicateScoringPlays(processedIds: number[]) {
        const processedIdsSet = new Set(processedIds)
        this.scoringPlays = this.scoringPlays.filter((scoringPlay) => {
            return !processedIdsSet.has(scoringPlay.id)
        })
    }
}
