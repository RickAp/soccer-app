import { Search, Filter, Heart } from 'lucide-react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { useMatchStore } from '@/store/matchStore'
import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

interface SearchFiltersProps {
  showFavoritesOnly: boolean
  onToggleFavorites: () => void
}

export default function SearchFilters({ showFavoritesOnly, onToggleFavorites }: SearchFiltersProps) {
  const { searchTerm, setSearchTerm, searchMatches, selectedLeague, setSelectedLeague } = useMatchStore()
  const [localSearch, setLocalSearch] = useState(searchTerm)
  const { t } = useLanguage()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(localSearch)
    searchMatches(localSearch)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" variant="secondary">
          {t('search')}
        </Button>
      </form>

      <div className="flex gap-2">
        <Select value={selectedLeague || 'all'} onValueChange={(v) => setSelectedLeague(v === 'all' ? '' : v)}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t('allLeagues')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allLeagues')}</SelectItem>
            <SelectItem value="Spanish La Liga">{t('laLiga')}</SelectItem>
            <SelectItem value="American Major League Soccer">{t('mls')}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant={showFavoritesOnly ? 'default' : 'outline'}
          onClick={onToggleFavorites}
          className="gap-2"
        >
          <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">{t('favorites')}</span>
        </Button>
      </div>
    </div>
  )
}
