import { getDailyGames } from "./espn_api/espn_api"

const main = async () => {
    await getDailyGames()
}

main()
