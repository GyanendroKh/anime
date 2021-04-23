import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Episode } from '../episode.entity';

@Entity()
@ObjectType()
export class GoGoAnimeEpisode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Field()
  link: string;

  @Column({
    unique: true,
    nullable: true
  })
  @Field({ nullable: true })
  videoId?: string;

  @OneToOne(() => Episode, {
    cascade: true
  })
  @JoinColumn()
  episode: Episode;
}
