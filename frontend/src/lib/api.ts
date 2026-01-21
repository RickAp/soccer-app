import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

export interface Match {
  idEvent: string
  strEvent: string
  strLeague: string
  strHomeTeam: string
  strAwayTeam: string
  strHomeTeamBadge: string
  strAwayTeamBadge: string
  dateEvent: string
  strTime: string
  strVenue: string
  strCity: string
  strCountry: string
  intHomeScore: string
  intAwayScore: string
  strStatus: string
  strThumb: string
}

export interface Weather {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: number
  description: string
  icon: string
  city: string
  country: string
  clouds: number
  pressure: number
  visibility: number
  datetime?: string
}

export interface Prediction {
  id: string
  matchId: string
  analysis: string
  weatherData: Weather
  matchData: Match
  createdAt: string
}

export const matchesApi = {
  sync: () => api.post<Match[]>('/matches/sync'),
  getAll: (league?: string) => api.get<Match[]>('/matches', { params: { league } }),
  getUpcoming: (league?: string) => api.get<Match[]>('/matches/upcoming', { params: { league } }),
  getOne: (id: string) => api.get<Match>(`/matches/${id}`),
  search: (q: string) => api.get<Match[]>('/matches/search', { params: { q } }),
}

export const weatherApi = {
  getCurrent: (city: string) => api.get<Weather>('/weather/current', { params: { city } }),
  getForecast: (city: string, date: string) => api.get<Weather>('/weather/forecast', { params: { city, date } }),
}

export const predictionsApi = {
  generate: (matchId: string) => api.post<Prediction>(`/predictions/${matchId}`),
  get: (matchId: string) => api.get<Prediction>(`/predictions/${matchId}`),
}

export default api

