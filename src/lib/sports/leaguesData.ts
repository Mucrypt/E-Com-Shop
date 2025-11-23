// app/sports-live/leaguesData.ts
export type MatchStatus = 'LIVE' | 'FT' | 'UPCOMING'

export type Match = {
  id: string
  status: MatchStatus
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  minute?: string
}

export type League = {
  id: string
  name: string
  country: string
  sport: 'football' | 'basketball' | 'tennis' | 'formula1' | 'esports'
  matches: Match[]
}

// FOOTBALL – Premier League style
const PREMIER_LEAGUE: League = {
  id: 'premier-league',
  name: 'Premier League',
  country: 'England',
  sport: 'football',
  matches: [
    {
      id: 'burnley-chelsea',
      status: 'FT',
      homeTeam: 'Burnley',
      awayTeam: 'Chelsea',
      homeScore: 0,
      awayScore: 2,
    },
    {
      id: 'bournemouth-westham',
      status: 'FT',
      homeTeam: 'AFC Bournemouth',
      awayTeam: 'West Ham United',
      homeScore: 2,
      awayScore: 2,
    },
    {
      id: 'brighton-brentford',
      status: 'FT',
      homeTeam: 'Brighton',
      awayTeam: 'Brentford',
      homeScore: 2,
      awayScore: 1,
    },
    {
      id: 'fulham-sunderland',
      status: 'FT',
      homeTeam: 'Fulham',
      awayTeam: 'Sunderland',
      homeScore: 1,
      awayScore: 0,
    },
  ],
}

// FOOTBALL – Serie A style
const SERIE_A: League = {
  id: 'serie-a',
  name: 'Serie A',
  country: 'Italy',
  sport: 'football',
  matches: [
    {
      id: 'milan-inter',
      status: 'LIVE',
      homeTeam: 'AC Milan',
      awayTeam: 'Inter',
      homeScore: 1,
      awayScore: 1,
      minute: "72'",
    },
    {
      id: 'juve-napoli',
      status: 'UPCOMING',
      homeTeam: 'Juventus',
      awayTeam: 'Napoli',
      homeScore: null,
      awayScore: null,
    },
  ],
}

// BASKETBALL – example
const NBA: League = {
  id: 'nba',
  name: 'NBA',
  country: 'USA',
  sport: 'basketball',
  matches: [
    {
      id: 'lakers-warriors',
      status: 'LIVE',
      homeTeam: 'Lakers',
      awayTeam: 'Warriors',
      homeScore: 87,
      awayScore: 81,
      minute: 'Q4 08:23',
    },
    {
      id: 'celtics-bucks',
      status: 'UPCOMING',
      homeTeam: 'Celtics',
      awayTeam: 'Bucks',
      homeScore: null,
      awayScore: null,
    },
  ],
}

export const LEAGUES: League[] = [PREMIER_LEAGUE, SERIE_A, NBA]

export function getLeaguesBySport(
  sport: League['sport'],
): League[] {
  return LEAGUES.filter((l) => l.sport === sport)
}

export function getLeagueById(id: string): League | undefined {
  return LEAGUES.find((l) => l.id === id)
}
