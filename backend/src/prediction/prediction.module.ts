import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PredictionController } from './prediction.controller';
import { PredictionService } from './prediction.service';
import { Prediction } from './prediction.entity';
import { MatchesModule } from '../matches/matches.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prediction]),
    MatchesModule,
    WeatherModule,
  ],
  controllers: [PredictionController],
  providers: [PredictionService],
})
export class PredictionModule {}

