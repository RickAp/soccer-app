import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MatchesService } from './matches.service';
import { SportsDbService } from './sportsdb.service';
import { Match } from './match.entity';

describe('MatchesService', () => {
  let service: MatchesService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    upsert: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockSportsDbService = {
    getAllLeagueMatches: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(Match),
          useValue: mockRepository,
        },
        {
          provide: SportsDbService,
          useValue: mockSportsDbService,
        },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return matches', async () => {
      const matches = [{ idEvent: '1', strEvent: 'Test Match' }];
      mockRepository.find.mockResolvedValue(matches);
      const result = await service.findAll();
      expect(result).toEqual(matches);
    });
  });

  describe('findOne', () => {
    it('should return a single match', async () => {
      const match = { idEvent: '1', strEvent: 'Test Match' };
      mockRepository.findOne.mockResolvedValue(match);
      const result = await service.findOne('1');
      expect(result).toEqual(match);
    });
  });
});

