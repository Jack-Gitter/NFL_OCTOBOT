import { configDotenv } from "dotenv"
import "reflect-metadata"
import datasource from "./datasource/datasource"
import { run } from "./coordinator/coordinator"
import { getTwitterClient } from "./x_api/x_api"
import cron from 'node-cron'
import { ScoringPlay } from "./entities/Play"
import { OctopusCount } from "./entities/OctopusCount"

const main = async () => {

    console.log('App Starting Up!')

    configDotenv()

    await datasource.initialize()
    const scoringPlayRepository = datasource.getRepository(ScoringPlay)
    const octopusCountRepository = datasource.getRepository(OctopusCount)
    
    const startingOctopusCount = await octopusCountRepository.findOneBy({id: 1}) ?? new OctopusCount(1, Number(process.env.STARTING_OCTOPUS_COUNT))

    await octopusCountRepository.save(startingOctopusCount)

    const twitterClient = await getTwitterClient()

    cron.schedule('* 10-22,23 * * 4-6,0,1', async () => {
        console.log('Checking for Octopi!')
        await run(twitterClient, scoringPlayRepository, datasource)
    })
}


main()
