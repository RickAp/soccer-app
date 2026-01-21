import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesModule } from './matches/matches.module';
import { WeatherModule } from './weather/weather.module';
import { PredictionModule } from './prediction/prediction.module';
import { Match } from './matches/match.entity';
import { Prediction } from './prediction/prediction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [Match, Prediction],
        synchronize: true,
        ssl: config.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
      }),
    }),
    MatchesModule,
    WeatherModule,
    PredictionModule,
  ],
})
export class AppModule {}

