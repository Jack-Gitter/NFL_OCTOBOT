import { configDotenv } from "dotenv"
import "reflect-metadata"
import datasource from "./datasource/datasource"
import { run } from "./coordinator/coordinator"
import { getTwitterClient } from "./x_api/x_api"
import cron from 'node-cron'
import { ScoringPlay } from "./entities/Play"
import { OctopusCount } from "./entities/OctopusCount"
import { runServer } from "./server/express"

const main = async () => {

    console.log('App Starting Up!')

    configDotenv()

    runServer()

    await datasource.initialize()
    const scoringPlayRepository = datasource.getRepository(ScoringPlay)
    const octopusCountRepository = datasource.getRepository(OctopusCount)
    
    const startingOctopusCount = await octopusCountRepository.findOneBy({id: 1}) ?? new OctopusCount(1, Number(process.env.STARTING_OCTOPUS_COUNT))

    await octopusCountRepository.save(startingOctopusCount)

    const twitterClient = await getTwitterClient()

    cron.schedule('* 12-22 * * 4-6,0,1', async () => {
        try {
            console.log('Checking for Octopi!')
            await run(twitterClient, scoringPlayRepository, datasource)
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error Name:')
                console.error(error.name)
                console.error('Error Message:')
                console.error(error.message)
                console.error('Error Stack:')
                console.error(error.stack)
            }
        }
    })
}


main()
