"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
// import cron from 'node-cron'
// import { checkForOctopus } from "./coordinator/coordinator"
const main = async () => {
    (0, dotenv_1.configDotenv)();
    //checkForOctopus()
    /*cron.schedule('* 10-23 * * 4-1', () => {
        checkForOctopus()
    })*/
};
main();
//# sourceMappingURL=main.js.map