import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { MatchesService } from './matches.service';

@ApiTags('matches')
@Controller('api/matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Sync matches from TheSportsDB' })
  async sync() {
    return this.matchesService.syncMatches();
  }

  @Get()
  @ApiOperation({ summary: 'Get all matches' })
  @ApiQuery({ name: 'league', required: false })
  async findAll(@Query('league') league?: string) {
    return this.matchesService.findAll(league);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming matches' })
  @ApiQuery({ name: 'league', required: false })
  async findUpcoming(@Query('league') league?: string) {
    return this.matchesService.findUpcoming(league);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search matches' })
  @ApiQuery({ name: 'q', required: true })
  async search(@Query('q') q: string) {
    return this.matchesService.search(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get match by ID' })
  @ApiParam({ name: 'id' })
  async findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }
}

