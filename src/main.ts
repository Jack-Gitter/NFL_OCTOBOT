import { getAtheleteInformation, getDailyGameIds, getGameTouchdownPlayIds, getOctopusInformation, } from "./espn_api/espn_api"

const main = async () => {
    const gameIds = await getDailyGameIds(new Date('10/05/2025'))
    const tdPlayIds = await getGameTouchdownPlayIds(401772746)
    const octoInfo = await getOctopusInformation(401772746, 4017727462324)
    const atheleteInfo = await getAtheleteInformation(octoInfo?.scorer.athlete.$ref ?? '')
}

main()
