import { getDailyGameIds, getGameScoringPlays, } from "./espn_api/espn_api"

const main = async () => {
    const gameIds = await getDailyGameIds()
    getGameScoringPlays(gameIds[0] ?? 0)
}

main()
