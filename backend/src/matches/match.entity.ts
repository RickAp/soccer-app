import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('matches')
export class Match {
  @PrimaryColumn()
  idEvent: string;

  @Column()
  strEvent: string;

  @Column()
  strLeague: string;

  @Column()
  strHomeTeam: string;

  @Column()
  strAwayTeam: string;

  @Column({ nullable: true })
  strHomeTeamBadge: string;

  @Column({ nullable: true })
  strAwayTeamBadge: string;

  @Column()
  dateEvent: string;

  @Column()
  strTime: string;

  @Column({ nullable: true })
  strVenue: string;

  @Column({ nullable: true })
  strCity: string;

  @Column({ nullable: true })
  strCountry: string;

  @Column({ nullable: true })
  intHomeScore: string;

  @Column({ nullable: true })
  intAwayScore: string;

  @Column({ nullable: true })
  strStatus: string;

  @Column({ nullable: true })
  strThumb: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

