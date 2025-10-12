import { DataSource } from "typeorm"
import { ScoringPlay } from "../entities/Play"
import { configDotenv } from "dotenv"
import "reflect-metadata"
import { OctopusCount } from "../entities/OctopusCount"
import { PlayerOctopusCount } from "../entities/PlayerOctopusCount"
import { Migrations1759845363781 } from "./migrations/1759845363781-migrations"
import { Migrations1760229921874 } from "./migrations/1760229921874-migrations"
import { Migrations1760230910337 } from "./migrations/1760230910337-migrations"
import { Migrations1760275897408 } from "./migrations/1760275897408-migrations"
import { Migrations1760276348584 } from "./migrations/1760276348584-migrations"
import { Migrations1760277371346 } from "./migrations/1760277371346-migrations"
import { Migrations1760277622939 } from "./migrations/1760277622939-migrations"
import { Donation } from "../entities/Donation"
import { Migrations1760277959113 } from "./migrations/1760277959113-migrations"
import { Migrations1760278286874 } from "./migrations/1760278286874-migrations"
import { Migrations1760278957485 } from "./migrations/1760278957485-migrations"
import { Migrations1760279475287 } from "./migrations/1760279475287-migrations"
import { Migrations1760280030893 } from "./migrations/1760280030893-migrations"
import { Migrations1760280030894 } from "./migrations/1760280030894-migrations"
import { Migrations1760287342286 } from "./migrations/1760287342286-migrations"

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
        Donation
    ],
    migrations: [
        Migrations1759845363781, 
        Migrations1760229921874, 
        Migrations1760230910337,
        Migrations1760275897408,
        Migrations1760276348584,
        Migrations1760277371346,
        Migrations1760277622939,
        Migrations1760277959113,
        Migrations1760278286874,
        Migrations1760278957485,
        Migrations1760279475287,
        Migrations1760280030893,
        Migrations1760280030894,
        Migrations1760287342286
    ],
    migrationsRun: true,
})
