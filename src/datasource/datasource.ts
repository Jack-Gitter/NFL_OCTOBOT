import { DataSource } from "typeorm"
import { ScoringPlay } from "../entities/Play"
import { configDotenv } from "dotenv"
import "reflect-metadata"
import { Migrations1759786272039 } from "./migrations/1759786272039-migrations"
import { OctopusCount } from "../entities/OctopusCount"
import { Migrations1759840030730 } from "./migrations/1759840030730-migrations"

configDotenv()

export default new DataSource({
    type: "postgres",
    host: process.env.PG_HOST as string,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USER as string,
    password: process.env.PG_PASS as string,
    database: process.env.PG_DB as string,
    entities: [ScoringPlay, OctopusCount],
    migrations: [Migrations1759786272039, Migrations1759840030730],
    migrationsRun: true,
})
