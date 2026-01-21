import { Sparkles, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { Prediction } from '@/lib/api'
import { useLanguage } from '@/lib/LanguageContext'

interface PredictionCardProps {
  prediction: Prediction | null
  loading: boolean
  onGenerate: () => void
}

export default function PredictionCard({ prediction, loading, onGenerate }: PredictionCardProps) {
  const { t, language } = useLanguage()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 animate-pulse text-amber-500" />
            {t('generatingAnalysis')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    )
  }

  if (!prediction) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-amber-500" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">{t('aiAnalysis')}</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-sm">
            {t('aiDescription')}
          </p>
          <Button onClick={onGenerate} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {t('generatePrediction')}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          {t('matchAnalysis')}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onGenerate} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {t('regenerate')}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {prediction.analysis.split('\n').map((paragraph, idx) => (
            paragraph.trim() && (
              <p key={idx} className="mb-3 text-foreground/90 leading-relaxed">
                {paragraph}
              </p>
            )
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          {t('generatedOn')} {new Date(prediction.createdAt).toLocaleString(language === 'es' ? 'es-ES' : 'en-US')}
        </p>
      </CardContent>
    </Card>
  )
}
