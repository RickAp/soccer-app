import { Cloud, Droplets, Wind, Thermometer, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Weather } from '@/lib/api'
import { getWindDirection } from '@/lib/utils'
import { useLanguage } from '@/lib/LanguageContext'

interface WeatherCardProps {
  weather: Weather
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { t } = useLanguage()

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white pb-12">
        <CardTitle className="flex items-center justify-between">
          <span>{t('weatherIn')} {weather.city}</span>
          <img
            src={getWeatherIcon(weather.icon)}
            alt={weather.description}
            className="h-16 w-16"
          />
        </CardTitle>
        <div className="mt-2">
          <div className="text-5xl font-display font-bold">{weather.temperature}°C</div>
          <p className="text-white/80 capitalize mt-1">{weather.description}</p>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <Thermometer className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">{t('feelsLike')}</p>
              <p className="font-medium">{weather.feelsLike}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">{t('humidity')}</p>
              <p className="font-medium">{weather.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <Wind className="h-5 w-5 text-teal-500" />
            <div>
              <p className="text-sm text-muted-foreground">{t('wind')}</p>
              <p className="font-medium">{weather.windSpeed} km/h {getWindDirection(weather.windDirection)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <Cloud className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">{t('clouds')}</p>
              <p className="font-medium">{weather.clouds}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted col-span-2">
            <Eye className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">{t('visibility')}</p>
              <p className="font-medium">{weather.visibility} km</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
