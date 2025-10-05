import { Event, Scoreboard } from "./types"

export const getDailyGames = async (date: Date = new Date()) => {
    const formattedDate = formatDate(date)
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${formattedDate}`
    const result = await fetch(url)
    const scoreboard: Scoreboard = await result.json()
    const gameIds = scoreboard.events.map((event: Event) => {
        return event.id
    })
    console.log(gameIds)
}


function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
