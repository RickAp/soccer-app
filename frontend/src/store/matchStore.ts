import { create } from 'zustand'
import { matchesApi, weatherApi, predictionsApi, Match, Weather, Prediction } from '../lib/api'

interface MatchState {
  matches: Match[]
  selectedMatch: Match | null
  weather: Weather | null
  prediction: Prediction | null
  loading: boolean
  error: string | null
  searchTerm: string
  selectedLeague: string
  favorites: string[]
  
  fetchMatches: (league?: string) => Promise<void>
  syncMatches: () => Promise<void>
  fetchMatch: (id: string) => Promise<void>
  fetchWeather: (city: string, date?: string) => Promise<void>
  generatePrediction: (matchId: string) => Promise<void>
  fetchPrediction: (matchId: string) => Promise<void>
  setSearchTerm: (term: string) => void
  setSelectedLeague: (league: string) => void
  searchMatches: (term: string) => Promise<void>
  toggleFavorite: (matchId: string) => void
  clearError: () => void
  clearMatchDetails: () => void
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: [],
  selectedMatch: null,
  weather: null,
  prediction: null,
  loading: false,
  error: null,
  searchTerm: '',
  selectedLeague: '',
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),

  fetchMatches: async (league?: string) => {
    set({ loading: true, error: null })
    try {
      const res = await matchesApi.getAll(league)
      set({ matches: res.data, loading: false })
    } catch (err) {
      set({ error: 'Error al cargar partidos', loading: false })
    }
  },

  syncMatches: async () => {
    try {
      await matchesApi.sync()
    } catch (err) {
      console.error('Error syncing matches:', err)
    }
  },

  fetchMatch: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const res = await matchesApi.getOne(id)
      set({ selectedMatch: res.data, loading: false })
    } catch (err) {
      set({ error: 'Error al cargar el partido', loading: false })
    }
  },

  fetchWeather: async (city: string, date?: string) => {
    try {
      const res = date 
        ? await weatherApi.getForecast(city, date)
        : await weatherApi.getCurrent(city)
      set({ weather: res.data })
    } catch (err) {
      console.error('Error fetching weather:', err)
    }
  },

  generatePrediction: async (matchId: string) => {
    set({ loading: true })
    try {
      const res = await predictionsApi.generate(matchId)
      set({ prediction: res.data, loading: false })
    } catch (err) {
      set({ error: 'Error al generar predicción', loading: false })
    }
  },

  fetchPrediction: async (matchId: string) => {
    try {
      const res = await predictionsApi.get(matchId)
      if (res.data) {
        set({ prediction: res.data })
      }
    } catch (err) {
      console.error('Error fetching prediction:', err)
    }
  },

  setSearchTerm: (term: string) => set({ searchTerm: term }),

  setSelectedLeague: (league: string) => {
    set({ selectedLeague: league })
    get().fetchMatches(league || undefined)
  },

  searchMatches: async (term: string) => {
    if (!term.trim()) {
      get().fetchMatches(get().selectedLeague || undefined)
      return
    }
    set({ loading: true })
    try {
      const res = await matchesApi.search(term)
      set({ matches: res.data, loading: false })
    } catch (err) {
      set({ error: 'Error en la búsqueda', loading: false })
    }
  },

  toggleFavorite: (matchId: string) => {
    const { favorites } = get()
    const newFavorites = favorites.includes(matchId)
      ? favorites.filter(id => id !== matchId)
      : [...favorites, matchId]
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    set({ favorites: newFavorites })
  },

  clearError: () => set({ error: null }),

  clearMatchDetails: () => set({ selectedMatch: null, weather: null, prediction: null }),
}))

