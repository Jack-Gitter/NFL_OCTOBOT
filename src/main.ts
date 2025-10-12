import { configDotenv } from "dotenv"
import "reflect-metadata"
import datasource from "./datasource/datasource"
import { run } from "./coordinator/coordinator"
import { getTwitterClient, tweetDonations } from "./x_api/x_api"
import cron from 'node-cron'
import { ScoringPlay } from "./entities/Play"
import { OctopusCount } from "./entities/OctopusCount"
import { runServer } from "./server/express"
import { TwitterApi } from "twitter-api-v2"
import { DataSource, Repository } from "typeorm"
import { generateDates, getHighestAllTimeDonator, getHighestMonthlyDonator, getMonthlyDonationCount } from "./utils"

const main = async () => {

    console.log('App Starting Up!')

    configDotenv()

    runServer()

    await datasource.initialize()
    const scoringPlayRepository = datasource.getRepository(ScoringPlay)
    const octopusCountRepository = datasource.getRepository(OctopusCount)
    
    const startingOctopusCount = await octopusCountRepository.findOneBy({id: '1'}) ?? new OctopusCount('1', Number(process.env.STARTING_OCTOPUS_COUNT))

    await octopusCountRepository.save(startingOctopusCount)

    const twitterClient = await getTwitterClient()

    const recoveryMode = process.env.RECOVERY_MODE?.toLowerCase() === 'true' ? true : false
    const recoveryStartDate = new Date(process.env.RECOVERY_START_DATE as string)
    const recoveryEndDate = new Date(process.env.RECOVERY_END_DATE as string)

    if (recoveryMode && recoveryStartDate) {
        console.log(`Entering recovery mode`)
        console.log(`Recovering games between ${recoveryStartDate.toISOString()} and ${recoveryEndDate.toISOString()}`)
        const dates = generateDates(recoveryStartDate, recoveryEndDate)
        for (const date of dates) {
            await processDay(twitterClient, scoringPlayRepository, datasource, date)
        }
    }

    cron.schedule('* 9-23,0-2 * * 4-6,0,1', async () => {
        processDay(twitterClient, scoringPlayRepository, datasource)
    })

    cron.schedule('0 4 * * 3', async () => {
        console.log(`Purging all scoring plays from database`)
        await scoringPlayRepository.clear()
    })
//0 0 28-31 * *
  cron.schedule('* * * * *', async () => {
    /*const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (tomorrow.getMonth() !== today.getMonth()) {*/
      console.log('📅 Running monthly donation summary...');

      const highestAllTime = await getHighestAllTimeDonator(datasource);
      const highestMonthly = await getHighestMonthlyDonator(datasource);
      const totalMonthlyDonations = await getMonthlyDonationCount(datasource)

      console.log(`highest all time: ${highestAllTime}`)
      console.log(`highest monthly: ${highestMonthly}`)
      console.log(`total monthly: ${totalMonthlyDonations}`)

      await tweetDonations(
            twitterClient, 
            highestAllTime?.donatorName, 
            highestAllTime?.total, 
            highestMonthly?.donatorName,
            highestMonthly?.total,
            totalMonthlyDonations.total
      )
    // }
  });
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
