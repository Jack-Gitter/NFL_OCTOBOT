import { getAtheleteInformation, getDailyGameIds, getGameScoringPlayIds, getOctopusInformation, } from "./espn_api/espn_api"

const main = async () => {
    const gameIds = await getDailyGameIds(new Date('09/16/2018'))
    const gameToTdPlayIdsArray = await Promise.all(gameIds.map(async (gameId: number) => {
        return await getGameScoringPlayIds(gameId)
    }))

    gameToTdPlayIdsArray.map(async (gameToTdPlayIds) => {
        const scoringPlayIds = gameToTdPlayIds.scoringPlayIds
        const octoInfoForAllPlays = await Promise.all(scoringPlayIds.map(async (scoringPlayId) => {
            return await getOctopusInformation(gameToTdPlayIds.gameId, scoringPlayId)
        }))
        const datas = await Promise.all(octoInfoForAllPlays.map(async (octoInfo) => {
            if (octoInfo) {
                const athlete = await getAtheleteInformation(octoInfo.scorer)
                return {
                    athlete, 
                    octoInfo
                }
            }
        }))
        for (const data of datas) {
            if (data?.athlete && data.octoInfo) {
                console.log(data?.athlete.firstName)
                console.log(data?.athlete.lastName)
                console.log(data?.octoInfo.shortText)
            }
        }

    })
}

main()
