"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAtheleteInformation = exports.getOctopusInformation = exports.getGameScoringPlayIds = exports.getDailyGameIds = void 0;
const types_1 = require("./types");
const getDailyGameIds = async (date = new Date()) => {
    const formattedDate = formatDate(date);
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${formattedDate}`;
    const result = await fetch(url);
    const scoreboard = await result.json();
    return scoreboard.events.map((event) => {
        return event.id;
    });
};
exports.getDailyGameIds = getDailyGameIds;
const getGameScoringPlayIds = async (gameId) => {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`;
    const result = await fetch(url);
    const game = await result.json();
    const scoringPlayIds = game.scoringPlays.filter((scoringPlay) => {
        return scoringPlay?.scoringType?.name === types_1.SCORING_TYPE.TOUCHDOWN;
    }).map((scoringPlay) => {
        return scoringPlay.id;
    });
    return { gameId: gameId, scoringPlayIds: scoringPlayIds };
};
exports.getGameScoringPlayIds = getGameScoringPlayIds;
const getOctopusInformation = async (gameId, scoringPlayId) => {
    const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameId}/competitions/${gameId}/plays/${scoringPlayId}`;
    const result = await fetch(url);
    const scoringPlayInformation = await result.json();
    const isTwoPointConversion = scoringPlayInformation?.pointAfterAttempt?.value === 2 || (scoringPlayInformation?.text?.includes('TWO-POINT CONVERSION ATTEMPT') && scoringPlayInformation?.text?.includes('ATTEMPT SUCCEEDS'));
    let patScorer = undefined;
    let tdScorer = undefined;
    if (isTwoPointConversion) {
        patScorer = scoringPlayInformation.participants.find((participant) => {
            return participant.type === types_1.SCORER_TYPE.PAT_SCORER;
        });
        tdScorer = scoringPlayInformation.participants.find((participant) => {
            return participant.type === types_1.SCORER_TYPE.TD_SCORER;
        });
    }
    if (patScorer && tdScorer && patScorer.athlete.$ref === tdScorer.athlete.$ref) {
        return {
            scorer: patScorer.athlete.$ref,
            shortText: scoringPlayInformation.shortText
        };
    }
};
exports.getOctopusInformation = getOctopusInformation;
const getAtheleteInformation = async (playerUrl) => {
    const result = await fetch(playerUrl);
    const athelete = await result.json();
    return athelete;
};
exports.getAtheleteInformation = getAtheleteInformation;
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}
//# sourceMappingURL=espn_api.js.map