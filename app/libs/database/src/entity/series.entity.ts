import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Episode } from './episode.entity';
import { Genre } from './genre.entity';

@Entity()
export class Series extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  @Generated('uuid')
  uuid: string;

  @Column()
  title: string;

  @Column({
    nullable: true
  })
  type: string;

  @Column({
    nullable: true
  })
  thumbnail: string;

  @Column({
    type: 'text',
    nullable: true
  })
  summary: string;

  @Column({
    nullable: true
  })
  released: string;

  @Column({
    nullable: true
  })
  status: string;

  @OneToMany(() => Episode, e => e.series, {
    cascade: true
  })
  episodes: Episode[];

  @ManyToMany(() => Genre, {
    cascade: true
  })
  @JoinTable()
  genres: Genre[];
}