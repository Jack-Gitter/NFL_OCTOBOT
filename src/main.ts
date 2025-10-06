import { getDailyGameIds, getGameTouchdownPlayIds, getOctopusInformation, } from "./espn_api/espn_api"

const main = async () => {
    const gameIds = await getDailyGameIds()
    const tdPlayIds = await getGameTouchdownPlayIds(gameIds[1] ?? 0)
    await getOctopusInformation(gameIds[1] ?? 0, tdPlayIds[1] ?? 0)
}

main()
