import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Series } from './series.entity';

@Entity()
export class GoGoAnimeSeries extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @Column()
  movieId: string;

  @OneToOne(() => Series)
  @JoinColumn()
  series: Series;
}
