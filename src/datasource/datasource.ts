import { DataSource } from "typeorm"
import { ScoringPlay } from "../entities/Play"
import { configDotenv } from "dotenv"
import "reflect-metadata"
import { OctopusCount } from "../entities/OctopusCount"
import { Migrations1759842320859 } from "./migrations/1759842320859-migrations"
import { PlayerOctopusCount } from "../entities/PlayerOctopusCount"
import { Migrations1759843054639 } from "./migrations/1759843054639-migrations"

configDotenv()

export default new DataSource({
    type: "postgres",
    host: process.env.PG_HOST as string,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USER as string,
    password: process.env.PG_PASS as string,
    database: process.env.PG_DB as string,
    entities: [ScoringPlay, OctopusCount, PlayerOctopusCount],
    migrations: [Migrations1759842320859, Migrations1759843054639],
    migrationsRun: true,
})
