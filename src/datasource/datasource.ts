import { DataSource } from "typeorm"
import { ScoringPlay } from "../entities/Play"
import { configDotenv } from "dotenv"
import "reflect-metadata"
import { Migrations1759786272039 } from "./migrations/1759786272039-migrations"

configDotenv()

export default new DataSource({
    type: "postgres",
    host: process.env.PG_HOST as string,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USER as string,
    password: process.env.PG_PASS as string,
    database: process.env.PG_DB as string,
    entities: [ScoringPlay],
    migrations: [Migrations1759786272039],
    migrationsRun: true,
})
