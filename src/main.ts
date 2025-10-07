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
    
    const startingOctopusCount = 
        new OctopusCount(Number(process.env.STARTING_OCTOPUS_COUNT))

    octopusCountRepository.insert(startingOctopusCount)


    const twitterClient = await getTwitterClient()

    //cron.schedule('* * * * *', async () => {
        await run(twitterClient, scoringPlayRepository)
    //})
}


main()
