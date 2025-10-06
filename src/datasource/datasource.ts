import { DataSource } from "typeorm"
import { Play } from "../entities/Play"

export default new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: process.env.PG_USER as string,
    password: process.env.PG_PASS as string,
    database: process.env.PG_DB as string,
    entities: [Play],
    migrations: [],
})
