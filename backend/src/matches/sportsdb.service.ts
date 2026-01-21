import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface SportsDbEvent {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  dateEvent: string;
  strTime: string;
  strVenue?: string;
  strCity?: string;
  strCountry?: string;
  intHomeScore?: string;
  intAwayScore?: string;
  strStatus?: string;
  strThumb?: string;
}

interface SportsDbResponse {
  events: SportsDbEvent[] | null;
}

interface TeamResponse {
  teams: { strTeamBadge?: string }[] | null;
}

@Injectable()
export class SportsDbService {
  private readonly logger = new Logger(SportsDbService.name);
  private readonly baseUrl = 'https://www.thesportsdb.com/api/v1/json/3';
  private readonly leagueIds = {
    laLiga: '4335',
    mls: '4346',
  };

  async getNextMatches(leagueId: string): Promise<SportsDbEvent[]> {
    try {
      const response = await axios.get<SportsDbResponse>(
        `${this.baseUrl}/eventsnextleague.php?id=${leagueId}`
      );
      return response.data.events || [];
    } catch (error) {
      this.logger.error(`Error fetching next matches: ${error}`);
      return [];
    }
  }

  async getPastMatches(leagueId: string): Promise<SportsDbEvent[]> {
    try {
      const response = await axios.get<SportsDbResponse>(
        `${this.baseUrl}/eventspastleague.php?id=${leagueId}`
      );
      return response.data.events || [];
    } catch (error) {
      this.logger.error(`Error fetching past matches: ${error}`);
      return [];
    }
  }

  async getTeamBadge(teamName: string): Promise<string | undefined> {
    try {
      const response = await axios.get<TeamResponse>(
        `${this.baseUrl}/searchteams.php?t=${encodeURIComponent(teamName)}`
      );
      return response.data.teams?.[0]?.strTeamBadge || undefined;
    } catch (error) {
      this.logger.error(`Error fetching team badge: ${error}`);
      return undefined;
    }
  }

  async getAllLeagueMatches(): Promise<SportsDbEvent[]> {
    const [laLigaNext, laLigaPast, mlsNext, mlsPast] = await Promise.all([
      this.getNextMatches(this.leagueIds.laLiga),
      this.getPastMatches(this.leagueIds.laLiga),
      this.getNextMatches(this.leagueIds.mls),
      this.getPastMatches(this.leagueIds.mls),
    ]);

    const allMatches = [...laLigaNext, ...laLigaPast, ...mlsNext, ...mlsPast];
    
    const matchesWithBadges = await Promise.all(
      allMatches.map(async (match) => {
        if (!match.strHomeTeamBadge || !match.strAwayTeamBadge) {
          const [homeBadge, awayBadge] = await Promise.all([
            this.getTeamBadge(match.strHomeTeam),
            this.getTeamBadge(match.strAwayTeam),
          ]);
          return {
            ...match,
            strHomeTeamBadge: match.strHomeTeamBadge || homeBadge,
            strAwayTeamBadge: match.strAwayTeamBadge || awayBadge,
          };
        }
        return match;
      })
    );

    return matchesWithBadges;
  }

  getLeagueIds() {
    return this.leagueIds;
  }
}

