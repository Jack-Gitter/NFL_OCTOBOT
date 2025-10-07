import { Athlete } from "../models/athlete"
import { Game } from "../models/game"
import { PointAfterAttempt } from "../models/pointAfterAttempt"
import { ScoringPlayInformation } from "../models/scoringPlay"
import { AthleteResponse, EventResponse, GameResponse, ParticipantResponse, ScoreboardResponse, SCORER_TYPE, SCORING_TYPE, ScoringPlayInformationResponse, ScoringPlayResponse } from "./types"

export const getScoringPlayInformation = async (gameId: number, scoringPlayIds: number[]) => {
    return await Promise.all(scoringPlayIds.map(async (scoringPlayId) => {
        const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameId}/competitions/${gameId}/plays/${scoringPlayId}`
        const result = await fetch(url)
        const scoringPlayInformationResponse: ScoringPlayInformationResponse = await result.json()
        return scoringPlayInformationResponse
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

export const getScoringPlayAthletes = async (scoringPlay: ScoringPlayInformationResponse) => {
        const athletes: Athlete[] = []

        await Promise.all(scoringPlay.participants.map(async (participant) => {
            const athleteResponse = await getAtheleteInformation(participant.athlete.$ref)
            if (athleteResponse) {
                const athlete = new Athlete(athleteResponse.firstName, athleteResponse.lastName, athleteResponse.id, participant.type)
                athletes.push(athlete)
            }
        }))
        return athletes
}

export const getScoringPlayPat = async (scoringPlay: ScoringPlayInformationResponse) => {
        const isTwoPointAttempt = 
                scoringPlay.pointAfterAttempt?.value === 2 || 
                (scoringPlay?.text?.includes('TWO-POINT CONVERSION ATTEMPT') && scoringPlay?.text?.includes('ATTEMPT SUCCEEDS'))

        const participant = scoringPlay.participants.find((participant: ParticipantResponse) => {
            return participant.type === SCORER_TYPE.PAT_SCORER
        })

        const patScorerResponse = await getAtheleteInformation(participant?.athlete.$ref)
        let patScorer = undefined
        if (patScorerResponse && participant) {
            patScorer = new Athlete(patScorerResponse.firstName, patScorerResponse.lastName, patScorerResponse.id, participant.type)
        }
        const pointAfterAttempt = new PointAfterAttempt(true, isTwoPointAttempt, patScorer)
        return pointAfterAttempt

}

export const getGameInformation = async (gameId: number) => {

    const scoringPlayIds = await getGameScoringPlayIds(gameId)
    const scoringPlayInformationResponse = await getScoringPlayInformation(gameId, scoringPlayIds)

    const scoringPlays = await Promise.all(scoringPlayInformationResponse.map(async (scoringPlay) => {
        const scoringPlayAthletes = await getScoringPlayAthletes(scoringPlay)
        const pointAfterAttempt = await getScoringPlayPat(scoringPlay)
        return new ScoringPlayInformation(scoringPlay.id, scoringPlayAthletes, pointAfterAttempt, scoringPlay.shortText, scoringPlay.text, undefined)

    }))

    return new Game(gameId, scoringPlays)

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

export const getAtheleteInformation = async(playerUrl?: string) => {
    if (!playerUrl) {
        return undefined
    }
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
