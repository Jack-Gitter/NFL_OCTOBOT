import { DataSource } from "typeorm"
import { ScoringPlay } from "../entities/Play"
import { configDotenv } from "dotenv"
import "reflect-metadata"
import { OctopusCount } from "../entities/OctopusCount"
import { PlayerOctopusCount } from "../entities/PlayerOctopusCount"
import { Migrations1759845363781 } from "./migrations/1759845363781-migrations"
import { Migrations1760229921874 } from "./migrations/1760229921874-migrations"
import { Migrations1760230910337 } from "./migrations/1760230910337-migrations"
import { AllTimeDonationCount } from "../entities/AllTimeDonationCount"
import { MonthlyDonationCount } from "../entities/MonthlyDonationCount"
import { Migrations1760275897408 } from "./migrations/1760275897408-migrations"
import { Migrations1760276348584 } from "./migrations/1760276348584-migrations"
import { Migrations1760277371346 } from "./migrations/1760277371346-migrations"

configDotenv()

export default new DataSource({
    type: "postgres",
    host: process.env.PG_HOST as string,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USER as string,
    password: process.env.PG_PASS as string,
    database: process.env.PG_DB as string,
    entities: [
        ScoringPlay, 
        OctopusCount, 
        PlayerOctopusCount, 
        AllTimeDonationCount, 
        MonthlyDonationCount
    ],
    migrations: [
        Migrations1759845363781, 
        Migrations1760229921874, 
        Migrations1760230910337,
        Migrations1760275897408,
        Migrations1760276348584,
        Migrations1760277371346
    ],
    migrationsRun: true,
})
