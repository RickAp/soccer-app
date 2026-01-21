import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Heart } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Match } from '@/lib/api'
import { formatTime, isUpcoming } from '@/lib/utils'
import { useMatchStore } from '@/store/matchStore'
import { useLanguage } from '@/lib/LanguageContext'

interface MatchCardProps {
  match: Match
  index: number
}

export default function MatchCard({ match, index }: MatchCardProps) {
  const { favorites, toggleFavorite } = useMatchStore()
  const isFavorite = favorites.includes(match.idEvent)
  const upcoming = isUpcoming(match.dateEvent)
  const { t, language } = useLanguage()

  const formatDateLocale = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Card
      className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-0">
        <div className="relative">
          {match.strThumb && (
            <div className="h-32 overflow-hidden">
              <img
                src={match.strThumb}
                alt={match.strEvent}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          
          <div className="absolute top-2 left-2 flex gap-2">
            <Badge variant={upcoming ? 'success' : 'secondary'}>
              {upcoming ? t('upcoming') : t('finished')}
            </Badge>
            {match.strLeague.includes('La Liga') && (
              <Badge variant="warning">{t('laLiga')}</Badge>
            )}
            {match.strLeague.includes('MLS') && (
              <Badge className="bg-blue-500 text-white">{t('mls')}</Badge>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(match.idEvent)
            }}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </Button>
        </div>

        <Link to={`/match/${match.idEvent}`} className="block p-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1 text-center">
              <div className="h-16 w-16 mx-auto mb-2 rounded-full bg-muted p-2 flex items-center justify-center">
                {match.strHomeTeamBadge ? (
                  <img
                    src={match.strHomeTeamBadge}
                    alt={match.strHomeTeam}
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <span className="font-display font-bold text-lg">
                    {match.strHomeTeam.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <p className="font-medium text-sm truncate">{match.strHomeTeam}</p>
            </div>

            <div className="flex flex-col items-center">
              {match.intHomeScore && match.intAwayScore ? (
                <div className="text-2xl font-display font-bold">
                  {match.intHomeScore} - {match.intAwayScore}
                </div>
              ) : (
                <span className="text-lg font-medium text-muted-foreground">{t('vs')}</span>
              )}
            </div>

            <div className="flex-1 text-center">
              <div className="h-16 w-16 mx-auto mb-2 rounded-full bg-muted p-2 flex items-center justify-center">
                {match.strAwayTeamBadge ? (
                  <img
                    src={match.strAwayTeamBadge}
                    alt={match.strAwayTeam}
                    className="h-12 w-12 object-contain"
                  />
                ) : (
                  <span className="font-display font-bold text-lg">
                    {match.strAwayTeam.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <p className="font-medium text-sm truncate">{match.strAwayTeam}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDateLocale(match.dateEvent)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(match.strTime)}</span>
            </div>
            {match.strVenue && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{match.strVenue}</span>
              </div>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
