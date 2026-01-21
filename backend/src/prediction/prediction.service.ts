import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Prediction } from './prediction.entity';
import { MatchesService } from '../matches/matches.service';
import { WeatherService, ForecastData } from '../weather/weather.service';
import { Match } from '../matches/match.entity';

@Injectable()
export class PredictionService {
  private readonly logger = new Logger(PredictionService.name);
  private openai: OpenAI;

  constructor(
    @InjectRepository(Prediction)
    private predictionRepo: Repository<Prediction>,
    private matchesService: MatchesService,
    private weatherService: WeatherService,
    private config: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.config.get('OPENAI_API_KEY'),
      baseURL: this.config.get('OPENAI_BASE_URL') || 'https://api.openai.com/v1',
    });
  }

  async generatePrediction(matchId: string): Promise<Prediction> {
    const match = await this.matchesService.findOne(matchId);
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const city = match.strCity || match.strVenue || 'Madrid';
    const matchDateTime = `${match.dateEvent}T${match.strTime}`;
    
    const weather = await this.weatherService.getForecast(city, matchDateTime);

    const prompt = this.buildPrompt(match, weather);
    
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.config.get('OPENAI_MODEL') || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un analista deportivo experto en fútbol. Proporciona análisis detallados sobre cómo las condiciones climáticas pueden afectar un partido. Sé específico y técnico pero accesible. Responde siempre en español.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      const analysis = completion.choices[0]?.message?.content || 'No se pudo generar el análisis';

      const prediction = this.predictionRepo.create({
        matchId,
        analysis,
        weatherData: weather as unknown as Record<string, unknown>,
        matchData: match as unknown as Record<string, unknown>,
      });

      return this.predictionRepo.save(prediction);
    } catch (error) {
      this.logger.error(`Error generating prediction: ${error}`);
      
      const fallbackAnalysis = this.generateFallbackAnalysis(match, weather);
      
      const prediction = this.predictionRepo.create({
        matchId,
        analysis: fallbackAnalysis,
        weatherData: weather as unknown as Record<string, unknown>,
        matchData: match as unknown as Record<string, unknown>,
      });

      return this.predictionRepo.save(prediction);
    }
  }

  private buildPrompt(match: Match, weather: ForecastData | null): string {
    const weatherInfo = weather
      ? `
Condiciones climáticas previstas:
- Temperatura: ${weather.temperature}°C (sensación térmica: ${weather.feelsLike}°C)
- Humedad: ${weather.humidity}%
- Viento: ${weather.windSpeed} km/h
- Descripción: ${weather.description}
- Nubosidad: ${weather.clouds}%
- Visibilidad: ${weather.visibility} km`
      : 'No hay datos climáticos disponibles';

    return `Analiza el siguiente partido de fútbol considerando las condiciones climáticas:

Partido: ${match.strHomeTeam} vs ${match.strAwayTeam}
Liga: ${match.strLeague}
Fecha: ${match.dateEvent} a las ${match.strTime}
Estadio: ${match.strVenue || 'No especificado'}
Ciudad: ${match.strCity || 'No especificada'}

${weatherInfo}

Proporciona:
1. Un análisis de cómo el clima puede afectar el desarrollo del partido
2. Si algún equipo podría verse favorecido o perjudicado
3. Aspectos técnicos del juego que podrían verse afectados (pases largos, posesión, etc.)
4. Una conclusión general sobre qué esperar del encuentro`;
  }

  private generateFallbackAnalysis(match: Match, weather: ForecastData | null): string {
    if (!weather) {
      return `Análisis del Partido: ${match.strHomeTeam} vs ${match.strAwayTeam}

No se pudieron obtener datos climáticos para esta ubicación. Sin embargo, se espera un encuentro competitivo entre ambos equipos en el marco de ${match.strLeague}.

El partido se disputará el ${match.dateEvent} en ${match.strVenue || 'el estadio del equipo local'}.`;
    }

    const temp = weather.temperature;
    const wind = weather.windSpeed;
    const humidity = weather.humidity;

    let tempAnalysis = '';
    if (temp < 10) {
      tempAnalysis = 'Las temperaturas frías podrían afectar la flexibilidad muscular de los jugadores, requiriendo un calentamiento más extenso.';
    } else if (temp > 28) {
      tempAnalysis = 'Las altas temperaturas podrían impactar el rendimiento físico, especialmente en la segunda mitad del partido.';
    } else {
      tempAnalysis = 'La temperatura es ideal para el rendimiento deportivo óptimo.';
    }

    let windAnalysis = '';
    if (wind > 30) {
      windAnalysis = 'El viento fuerte podría afectar significativamente los pases largos y los centros.';
    } else if (wind > 15) {
      windAnalysis = 'El viento moderado podría influir en la trayectoria de los balones aéreos.';
    } else {
      windAnalysis = 'El viento ligero no debería afectar significativamente el juego.';
    }

    return `Análisis del Partido: ${match.strHomeTeam} vs ${match.strAwayTeam}

Basado en las condiciones climáticas previstas, se espera un partido interesante. Con una temperatura de ${temp}°C y viento de ${wind} km/h, las condiciones son ${temp >= 15 && temp <= 25 ? 'favorables' : 'desafiantes'} para el fútbol.

${tempAnalysis}

${windAnalysis}

La humedad del ${humidity}% ${humidity > 70 ? 'podría hacer que el balón sea más resbaladizo' : 'está dentro de rangos normales'}.

El encuentro se disputará en ${match.strVenue || 'el estadio local'}, donde ${match.strHomeTeam} buscará aprovechar su condición de local.`;
  }

  async findByMatch(matchId: string): Promise<Prediction | null> {
    return this.predictionRepo.findOne({
      where: { matchId },
      order: { createdAt: 'DESC' },
    });
  }
}

