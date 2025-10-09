import { configDotenv } from "dotenv"
import "reflect-metadata"
import datasource from "./datasource/datasource"
import { run } from "./coordinator/coordinator"
import { getTwitterClient } from "./x_api/x_api"
import cron from 'node-cron'
import { ScoringPlay } from "./entities/Play"
import { OctopusCount } from "./entities/OctopusCount"
import { runServer } from "./server/express"
import { TwitterApi } from "twitter-api-v2"
import { DataSource, Repository } from "typeorm"
import { generateDates } from "./utils"

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

    const recoveryMode = process.env.RECOVERY_MODE
    const recoveryDate = new Date(process.env.RECOVERY_DATE as string)

    if (recoveryMode && recoveryDate) {
        const dates = generateDates(recoveryDate)
        for (const date of dates) {
            await processDay(twitterClient, scoringPlayRepository, datasource, date)
        }
    }

    cron.schedule('* 9-23,0-2 * * 4-6,0,1', async () => {
        processDay(twitterClient, scoringPlayRepository, datasource)
    })
}

const processDay = async (twitterClient: TwitterApi, scoringPlayRepository: Repository<ScoringPlay>, datasource: DataSource, date: Date = new Date()) => {
    try {
        console.log('Checking for Octopi!')
        await run(twitterClient, scoringPlayRepository, datasource, date)
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
}

main()
