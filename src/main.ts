import { configDotenv } from "dotenv"
import cron from 'node-cron'
import { checkForOctopus } from "./coordinator/coordinator"

const main = async () => {
    configDotenv()
    cron.schedule('* 10-23 * * 4-1', () => {
        checkForOctopus()
    })
}


main()
