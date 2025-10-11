import { ScoringPlayInformation } from "./scoringPlay";

export class Game {
    constructor(public gameId: number, public scoringPlays: ScoringPlayInformation[] = []) {}

    public deduplicateProcessedPlays(playIds: number[]) {
        const gameScoringPlays = this.scoringPlays?.length
        const playIdsSet = new Set(playIds)
        this.scoringPlays = this.scoringPlays?.filter(scoringPlay => {
            return !playIdsSet.has(scoringPlay.id)
        })
        const unprocessedGameScoringPlays = this.scoringPlays.length
        console.log(
            `Removed ${gameScoringPlays - unprocessedGameScoringPlays} already processed scoring plays from game ${this.gameId}`
        )

    }

    public filterScoringPlays() {
        const scoringPlays = this.scoringPlays?.filter((scoringPlay) => {
            return scoringPlay.isOctopus() || scoringPlay.isMissedOctopus()
        })
        console.log(`Found ${scoringPlays.length} new plays that are either octopi, or missed octopi`)
        return scoringPlays
    }
}
