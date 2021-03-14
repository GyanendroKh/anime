import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Series } from './series.entity';

@Entity()
export class Episode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  @Generated('uuid')
  uuid: string;

  @Column()
  number: number;

  @Column()
  name: string;

  @Column({
    unique: true
  })
  link: string;

  @Column({
    unique: true
  })
  videoId: string;

  @ManyToOne(() => Series, s => s.episodes)
  series: Series;
}
