import { Event, Game, Scoreboard, ScoringPlay, ScoringPlayInformation } from "./types"

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
    console.log(gameId)
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`
    const result = await fetch(url)
    const game: Game = await result.json()
    return game.scoringPlays.filter((scoringPlay: ScoringPlay) => {
        return scoringPlay.scoringType.name === 'touchdown'
    }).map((scoringPlay: ScoringPlay) => {
        return scoringPlay.id
    })
}

export const getOctopusInformation = async(gameId: number, scoringPlayId: number) => {
    const url = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${gameId}/competitions/${gameId}/plays/${scoringPlayId}`
    const result = await fetch(url)
    const scoringPlayInformation: ScoringPlayInformation = await result.json()
    // not just 16, there are probably other ids that are two point conversions
    const twoPointConversion = scoringPlayInformation.pointAfterAttempt.id === 16
    if (twoPointConversion) {
        // get the participants who have values "patScorer" and "scorer"
        // if they are the same, we found one!

    }
    console.log(scoringPlayInformation.participants)
}


function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
