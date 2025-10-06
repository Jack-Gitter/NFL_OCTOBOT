import { getDailyGameIds, getGameTouchdownPlays, } from "./espn_api/espn_api"

const main = async () => {
    const gameIds = await getDailyGameIds()
    getGameTouchdownPlays(gameIds[1] ?? 0)
}

main()
