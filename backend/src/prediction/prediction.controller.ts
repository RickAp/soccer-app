import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PredictionService } from './prediction.service';

@ApiTags('predictions')
@Controller('api/predictions')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post(':matchId')
  @ApiOperation({ summary: 'Generate AI prediction for a match' })
  @ApiParam({ name: 'matchId' })
  async generate(@Param('matchId') matchId: string) {
    return this.predictionService.generatePrediction(matchId);
  }

  @Get(':matchId')
  @ApiOperation({ summary: 'Get existing prediction for a match' })
  @ApiParam({ name: 'matchId' })
  async findByMatch(@Param('matchId') matchId: string) {
    return this.predictionService.findByMatch(matchId);
  }
}

