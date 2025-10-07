import { Athlete } from "../models/athlete"
import { Game } from "../models/game"
import { PointAfterAttempt } from "../models/pointAfterAttempt"
import { ScoringPlayInformation } from "../models/scoringPlay"
import { AthleteResponse, EventResponse, GameResponse, ScoreboardResponse, SCORING_TYPE, ScoringPlayInformationResponse, ScoringPlayResponse } from "./types"

export const getScoringPlayInformation = async (gameId: number, scoringPlayIds: number[]) => {
    return await Promise.all(scoringPlayIds.map(async (scoringPlayId) => {
        const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameId}/competitions/${gameId}/plays/${scoringPlayId}`
        const result = await fetch(url)
        const scoringPlayInformation: ScoringPlayInformationResponse = await result.json()
        return scoringPlayInformation
    }))
}

export const getGameScoringPlayIds = async (gameId: number) => {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`
    const result = await fetch(url)
    const game: GameResponse = await result.json()
    return game.scoringPlays.filter((scoringPlay: ScoringPlayResponse) => {
        return scoringPlay?.scoringType?.name === SCORING_TYPE.TOUCHDOWN
    }).map((scoringPlay: ScoringPlayResponse) => {
        return scoringPlay.id
    })
}

export const getGameInformation = async (gameId: number) => {

    const scoringPlayIds = await getGameScoringPlayIds(gameId)
    const scoringPlayInformation = await getScoringPlayInformation(gameId, scoringPlayIds)

    const scoringPlayInfo = await Promise.all(scoringPlayInformation.map(async (scoringPlay) => {
        const athletes = []
        for (const participants of scoringPlay.participants) {
            const athleteResponse = await getAtheleteInformation(participants.athlete.$ref)
            const athlete = new Athlete(athleteResponse.firstName, athleteResponse.lastName, athleteResponse.id, participants.type)
            athletes.push(athlete)
        }

        const isTwoPointAttempt = 
                scoringPlay.pointAfterAttempt?.value === 2 || 
                (scoringPlay?.text?.includes('TWO-POINT CONVERSION ATTEMPT') && scoringPlay?.text?.includes('ATTEMPT SUCCEEDS'))

        const pointAfterAttemptModel = new PointAfterAttempt(true, isTwoPointAttempt)
        return new ScoringPlayInformation(scoringPlay.id, athletes, pointAfterAttemptModel, scoringPlay.shortText, scoringPlay.text, undefined)

    }))

    return new Game(gameId, scoringPlayInfo)

}

export const getDailyGameIds = async (date: Date = new Date()) => {
    const formattedDate = formatDate(date)
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${formattedDate}`
    const result = await fetch(url)
    const scoreboard: ScoreboardResponse = await result.json()
    return scoreboard.events.map((event: EventResponse) => {
        return event.id
    })
}

export const getAtheleteInformation = async(playerUrl: string) => {
    const result = await fetch(playerUrl)
    const athelete: AthleteResponse = await result.json()
    return athelete
}


function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
