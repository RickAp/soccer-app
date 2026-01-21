import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import WeatherCard from '@/components/WeatherCard'
import PredictionCard from '@/components/PredictionCard'
import { useMatchStore } from '@/store/matchStore'
import { formatTime, isUpcoming } from '@/lib/utils'
import { useLanguage } from '@/lib/LanguageContext'

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, language } = useLanguage()
  const {
    selectedMatch,
    weather,
    prediction,
    loading,
    fetchMatch,
    fetchWeather,
    fetchPrediction,
    generatePrediction,
    clearMatchDetails,
  } = useMatchStore()

  useEffect(() => {
    clearMatchDetails()
    if (id) {
      fetchMatch(id)
      fetchPrediction(id)
    }
  }, [id, fetchMatch, fetchPrediction, clearMatchDetails])

  useEffect(() => {
    if (selectedMatch) {
      const city = selectedMatch.strCity || selectedMatch.strVenue || 'Madrid'
      const date = `${selectedMatch.dateEvent}T${selectedMatch.strTime}`
      fetchWeather(city, date)
    }
  }, [selectedMatch, fetchWeather])

  const formatDateLocale = (dateStr: string): string => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading && !selectedMatch) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-32" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!selectedMatch) {
    return (
      <div className="text-center py-16">
        <Trophy className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">{t('matchNotFound')}</h2>
        <Link to="/">
          <Button className="mt-4">{t('backToHome')}</Button>
        </Link>
      </div>
    )
  }

  const upcoming = isUpcoming(selectedMatch.dateEvent)

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">{selectedMatch.strEvent}</h1>
          <p className="text-muted-foreground">{selectedMatch.strLeague}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            {selectedMatch.strThumb && (
              <div className="h-48 overflow-hidden">
                <img
                  src={selectedMatch.strThumb}
                  alt={selectedMatch.strEvent}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4 sm:gap-8 mb-6">
                <div className="flex-1 text-center">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-3 rounded-full bg-muted p-3 flex items-center justify-center">
                    {selectedMatch.strHomeTeamBadge ? (
                      <img
                        src={selectedMatch.strHomeTeamBadge}
                        alt={selectedMatch.strHomeTeam}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="font-display font-bold text-2xl">
                        {selectedMatch.strHomeTeam.slice(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-lg">{selectedMatch.strHomeTeam}</h3>
                  <Badge variant="outline" className="mt-1">{t('local')}</Badge>
                </div>

                <div className="text-center">
                  {selectedMatch.intHomeScore && selectedMatch.intAwayScore ? (
                    <div className="text-4xl sm:text-5xl font-display font-bold">
                      {selectedMatch.intHomeScore} - {selectedMatch.intAwayScore}
                    </div>
                  ) : (
                    <div className="text-3xl font-display font-bold text-muted-foreground">VS</div>
                  )}
                  <Badge variant={upcoming ? 'success' : 'secondary'} className="mt-2">
                    {upcoming ? t('upcoming') : t('finished')}
                  </Badge>
                </div>

                <div className="flex-1 text-center">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 mx-auto mb-3 rounded-full bg-muted p-3 flex items-center justify-center">
                    {selectedMatch.strAwayTeamBadge ? (
                      <img
                        src={selectedMatch.strAwayTeamBadge}
                        alt={selectedMatch.strAwayTeam}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="font-display font-bold text-2xl">
                        {selectedMatch.strAwayTeam.slice(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-lg">{selectedMatch.strAwayTeam}</h3>
                  <Badge variant="outline" className="mt-1">{t('visitor')}</Badge>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('date')}</p>
                    <p className="font-medium">{formatDateLocale(selectedMatch.dateEvent)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('time')}</p>
                    <p className="font-medium">{formatTime(selectedMatch.strTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('stadium')}</p>
                    <p className="font-medium truncate">{selectedMatch.strVenue || t('notSpecified')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <PredictionCard
            prediction={prediction}
            loading={loading}
            onGenerate={() => id && generatePrediction(id)}
          />
        </div>

        <div className="space-y-6">
          {weather ? (
            <WeatherCard weather={weather} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('weather')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t('noWeatherData')}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t('matchInfo')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('league')}</p>
                <p className="font-medium">{selectedMatch.strLeague}</p>
              </div>
              {selectedMatch.strCity && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('city')}</p>
                  <p className="font-medium">{selectedMatch.strCity}</p>
                </div>
              )}
              {selectedMatch.strCountry && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('country')}</p>
                  <p className="font-medium">{selectedMatch.strCountry}</p>
                </div>
              )}
              {selectedMatch.strStatus && (
                <div>
                  <p className="text-sm text-muted-foreground">{t('status')}</p>
                  <p className="font-medium">{selectedMatch.strStatus}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
