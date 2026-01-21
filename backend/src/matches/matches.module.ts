import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { SportsDbService } from './sportsdb.service';
import { Match } from './match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    HttpModule,
  ],
  controllers: [MatchesController],
  providers: [MatchesService, SportsDbService],
  exports: [MatchesService, SportsDbService],
})
export class MatchesModule {}

