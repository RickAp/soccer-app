import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('predictions')
export class Prediction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column('text')
  analysis: string;

  @Column('jsonb', { nullable: true })
  weatherData: Record<string, unknown>;

  @Column('jsonb', { nullable: true })
  matchData: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}

