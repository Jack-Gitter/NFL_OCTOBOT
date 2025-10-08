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
            `Filtered ${gameScoringPlays - unprocessedGameScoringPlays} scoring plays
             from game ${this.gameId} as they have been processed already`
        )

    }

    public filterOctopusPlays() {
        const successfulOctopi = this.scoringPlays?.filter((scoringPlay) => {
            return scoringPlay.isOctopus()
        })
        console.log(`Found ${this.scoringPlays.length} new octopus plays`)
        return successfulOctopi
    }

    public filterFailedOctopusPlays() {
        const failedOctopi = this.scoringPlays?.filter((scoringPlay) => {
            return scoringPlay.isMissedOctopus()
        })
        console.log(`Found ${this.scoringPlays.length} new failed octopus plays`)
        return failedOctopi

    }
}
