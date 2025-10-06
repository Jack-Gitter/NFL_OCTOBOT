import { Athlete, Event, Game, Participant, POINT_AFTER_ATTEMPT, Scoreboard, SCORER_TYPE, SCORING_TYPE, ScoringPlay, ScoringPlayInformation } from "./types"

export const getDailyGameIds = async (date: Date = new Date()) => {
    const formattedDate = formatDate(date)
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${formattedDate}`
    const result = await fetch(url)
    const scoreboard: Scoreboard = await result.json()
    return scoreboard.events.map((event: Event) => {
        return event.id
    })
}

export const getGameTouchdownPlayIds = async (gameId: number) => {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`
    const result = await fetch(url)
    const game: Game = await result.json()
    return game.scoringPlays.filter((scoringPlay: ScoringPlay) => {
        return scoringPlay?.scoringType?.name === SCORING_TYPE.TOUCHDOWN
    }).map((scoringPlay: ScoringPlay) => {
        return scoringPlay.id
    })
}

export const getOctopusInformation = async(gameId: number, scoringPlayId: number) => {
    const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameId}/competitions/${gameId}/plays/${scoringPlayId}`
    const result = await fetch(url)
    const scoringPlayInformation: ScoringPlayInformation = await result.json()
    console.log(scoringPlayInformation)
    const twoPointConversion = scoringPlayInformation.pointAfterAttempt.value === 2
    const legacyTwoPointConversion = scoringPlayInformation?.text?.includes('TWO-POINT CONVERSION ATTEMPT') && scoringPlayInformation?.text?.includes('ATTEMPT SUCCEEDS')
    let patScorer = undefined
    let tdScorer = undefined 
    if (twoPointConversion || legacyTwoPointConversion) {
        patScorer = scoringPlayInformation.participants.find((participant: Participant) => {
            return participant.type === SCORER_TYPE.PAT_SCORER
        })
        tdScorer = scoringPlayInformation.participants.find((participant: Participant) => {
            return participant.type === SCORER_TYPE.TD_SCORER
        })
    }
    if (patScorer && tdScorer && patScorer.athlete.$ref === tdScorer.athlete.$ref) {
        return {
            scorer: patScorer.athlete.$ref,
            text: scoringPlayInformation.shortText
        }
    }
}

export const getAtheleteInformation = async(playerUrl: string) => {
    const result = await fetch(playerUrl)
    const athelete: Athlete = await result.json()
    return athelete
}


function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
