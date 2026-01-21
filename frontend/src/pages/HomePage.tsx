import { useState, useMemo } from 'react'
import { Trophy } from 'lucide-react'
import MatchCard from '@/components/MatchCard'
import SearchFilters from '@/components/SearchFilters'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMatchStore } from '@/store/matchStore'
import { isUpcoming } from '@/lib/utils'
import { useLanguage } from '@/lib/LanguageContext'

export default function HomePage() {
  const { matches, loading, favorites } = useMatchStore()
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const { t } = useLanguage()

  const filteredMatches = useMemo(() => {
    if (showFavoritesOnly) {
      return matches.filter(m => favorites.includes(m.idEvent))
    }
    return matches
  }, [matches, favorites, showFavoritesOnly])

  const upcomingMatches = filteredMatches.filter(m => isUpcoming(m.dateEvent))
  const pastMatches = filteredMatches.filter(m => !isUpcoming(m.dateEvent))

  if (loading && matches.length === 0) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold mb-2">{t('loading')}</h2>
          <p className="text-muted-foreground">{t('syncing')}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-4 space-y-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <div className="flex justify-between">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-16 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          <span className="gradient-text">{t('laLiga')}</span> & <span className="text-blue-500">{t('mls')}</span>
        </h2>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <SearchFilters 
        showFavoritesOnly={showFavoritesOnly} 
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)} 
      />

      {filteredMatches.length === 0 ? (
        <div className="text-center py-16">
          <Trophy className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">{t('noMatchesFound')}</h3>
          <p className="text-muted-foreground">
            {showFavoritesOnly 
              ? t('noFavorites')
              : t('tryAnotherSearch')}
          </p>
        </div>
      ) : (
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="upcoming" className="gap-2">
              {t('upcoming')} ({upcomingMatches.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              {t('finished')} ({pastMatches.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingMatches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t('noMatchesFound')}
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingMatches.map((match, index) => (
                  <MatchCard key={match.idEvent} match={match} index={index} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastMatches.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t('noMatchesFound')}
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pastMatches.map((match, index) => (
                  <MatchCard key={match.idEvent} match={match} index={index} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
