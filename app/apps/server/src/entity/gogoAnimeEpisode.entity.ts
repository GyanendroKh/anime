import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Episode } from './episode.entity';

@Entity()
export class GoGoAnimeEpisode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @Column()
  videoId: string;

  @OneToOne(() => Episode)
  @JoinColumn()
  episode: Episode;
}
