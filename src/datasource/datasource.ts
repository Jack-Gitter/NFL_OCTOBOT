import { DataSource } from "typeorm"
import { ScoringPlay } from "../entities/Play"
import { configDotenv } from "dotenv"
import "reflect-metadata"

configDotenv()

export default new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: process.env.PG_USER as string,
    password: process.env.PG_PASS as string,
    database: process.env.PG_DB as string,
    entities: [ScoringPlay],
    migrations: [],
})
