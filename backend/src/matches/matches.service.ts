import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';
import { SportsDbService } from './sportsdb.service';

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    @InjectRepository(Match)
    private matchRepo: Repository<Match>,
    private sportsDbService: SportsDbService,
  ) {}

  async syncMatches(): Promise<Match[]> {
    const events = await this.sportsDbService.getAllLeagueMatches();
    
    const matches = events.map((event) => ({
      idEvent: event.idEvent,
      strEvent: event.strEvent,
      strLeague: event.strLeague,
      strHomeTeam: event.strHomeTeam,
      strAwayTeam: event.strAwayTeam,
      strHomeTeamBadge: event.strHomeTeamBadge || '',
      strAwayTeamBadge: event.strAwayTeamBadge || '',
      dateEvent: event.dateEvent,
      strTime: event.strTime,
      strVenue: event.strVenue || '',
      strCity: event.strCity || '',
      strCountry: event.strCountry || '',
      intHomeScore: event.intHomeScore || '',
      intAwayScore: event.intAwayScore || '',
      strStatus: event.strStatus || '',
      strThumb: event.strThumb || '',
    }));

    for (const match of matches) {
      await this.matchRepo.upsert(match, ['idEvent']);
    }

    this.logger.log(`Synced ${matches.length} matches`);
    return this.matchRepo.find({ order: { dateEvent: 'ASC', strTime: 'ASC' } });
  }

  async findAll(league?: string): Promise<Match[]> {
    const where = league ? { strLeague: league } : {};
    return this.matchRepo.find({
      where,
      order: { dateEvent: 'ASC', strTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Match | null> {
    return this.matchRepo.findOne({ where: { idEvent: id } });
  }

  async findUpcoming(league?: string): Promise<Match[]> {
    const today = new Date().toISOString().split('T')[0];
    const query = this.matchRepo
      .createQueryBuilder('match')
      .where('match.dateEvent >= :today', { today })
      .orderBy('match.dateEvent', 'ASC')
      .addOrderBy('match.strTime', 'ASC');

    if (league) {
      query.andWhere('match.strLeague = :league', { league });
    }

    return query.getMany();
  }

  async search(term: string): Promise<Match[]> {
    return this.matchRepo
      .createQueryBuilder('match')
      .where('LOWER(match.strHomeTeam) LIKE LOWER(:term)', { term: `%${term}%` })
      .orWhere('LOWER(match.strAwayTeam) LIKE LOWER(:term)', { term: `%${term}%` })
      .orWhere('LOWER(match.strVenue) LIKE LOWER(:term)', { term: `%${term}%` })
      .orderBy('match.dateEvent', 'ASC')
      .getMany();
  }
}

