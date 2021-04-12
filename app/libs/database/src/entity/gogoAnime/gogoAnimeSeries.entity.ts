import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Series } from '../series.entity';

@Entity()
export class GoGoAnimeSeries extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  link: string;

  @Column({ unique: true })
  movieId: string;

  @OneToOne(() => Series, {
    cascade: true
  })
  @JoinColumn()
  series: Series;
}
