import { ScoringPlayInformation } from "./scoringPlay";

export class Game {
    constructor(public gameId: string, public scoringPlays: ScoringPlayInformation[] = []) {}

    public deduplicateProcessedPlays(playIds: string[]) {
        const gameScoringPlays = this.scoringPlays?.length
        const playIdsSet = new Set(playIds)
        this.scoringPlays = this.scoringPlays?.filter(scoringPlay => {
            return !playIdsSet.has(scoringPlay.id)
        })
        const unprocessedGameScoringPlays = this.scoringPlays.length
        console.log(
            `Removed ${gameScoringPlays - unprocessedGameScoringPlays} already processed opctopi or unfinished octopi from game with id: ${this.gameId}`
        )

    }

    public filterScoringPlays() {
        const scoringPlays = this.scoringPlays?.filter((scoringPlay) => {
            return scoringPlay.isOctopus() || scoringPlay.isMissedOctopus()
        })
        console.log(`Found ${scoringPlays.length} new plays that are either octopi, or missed octopi from game with id: ${this.gameId}`)
        return scoringPlays
    }
}
