"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForOctopus = void 0;
const espn_api_1 = require("../espn_api/espn_api");
const x_api_1 = require("../x_api/x_api");
const checkForOctopus = async () => {
    const twitterClient = await (0, x_api_1.getTwitterClient)();
    const gameIds = await (0, espn_api_1.getDailyGameIds)(new Date('09/29/2024'));
    const gameToScoringPlayIdsArray = await Promise.all(gameIds.map(async (gameId) => {
        return await (0, espn_api_1.getGameScoringPlayIds)(gameId);
    }));
    await Promise.all(gameToScoringPlayIdsArray.map(async (gameToScoringPlayIds) => {
        const scoringPlayIds = gameToScoringPlayIds.scoringPlayIds;
        const octopusInformationArray = await Promise.all(scoringPlayIds.map(async (scoringPlayId) => {
            return await (0, espn_api_1.getOctopusInformation)(gameToScoringPlayIds.gameId, scoringPlayId);
        }));
        const athleteAndOctopusInformationArray = await Promise.all(octopusInformationArray.map(async (octopusInformation) => {
            if (octopusInformation) {
                const athlete = await (0, espn_api_1.getAtheleteInformation)(octopusInformation.scorer);
                return {
                    athlete,
                    octopusInformation
                };
            }
        }));
        for (const athleteAndOctopusInformation of athleteAndOctopusInformationArray) {
            if (athleteAndOctopusInformation?.athlete && athleteAndOctopusInformation.octopusInformation) {
                (0, x_api_1.postOctopus)(twitterClient, athleteAndOctopusInformation?.octopusInformation.shortText);
            }
        }
    }));
};
exports.checkForOctopus = checkForOctopus;
//# sourceMappingURL=coordinator.js.map