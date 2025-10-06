import { ScoringPlayInformation } from "../espn_api/types";

export class Game {
    constructor(public gameId: number, public scoringPlays?: ScoringPlayInformation[]) {}

    public deduplicateProcessedPlays(playIds: number[]) {
        const playIdsSet = new Set(playIds)
        this.scoringPlays = this.scoringPlays?.filter(scoringPlay => {
            return !playIdsSet.has(scoringPlay.id)
        })
    }
}
