import { getAtheleteInformation, getDailyGameIds, getGameTouchdownPlayIds, getOctopusInformation, } from "./espn_api/espn_api"

const main = async () => {
    const gameIds = await getDailyGameIds(new Date('12/25/2016'))
    for (const gameId of gameIds) {
        const tdPlayIds = await getGameTouchdownPlayIds(gameId)
        for (const tdPlayId of tdPlayIds) {
            const octoInfo = await getOctopusInformation(gameId, tdPlayId)
            if (octoInfo) {
                const atheleteInfo = await getAtheleteInformation(octoInfo.scorer)
                console.log(atheleteInfo.firstName)
                console.log(atheleteInfo.lastName)
                console.log(octoInfo.text)
            }
        }
    }
}

main()
