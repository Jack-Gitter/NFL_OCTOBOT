import { configDotenv } from "dotenv"
import cron from 'node-cron'
import { checkForOctopus } from "./coordinator/coordinator"

const main = async () => {
    configDotenv()
    cron.schedule('* * * * *', () => {
        checkForOctopus()
    })
}


main()
