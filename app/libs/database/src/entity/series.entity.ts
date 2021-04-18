import { Field, ObjectType } from '@nestjs/graphql';
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
@ObjectType()
export class Series extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  @Generated('uuid')
  @Field()
  uuid: string;

  @Column()
  @Field()
  title: string;

  @Column({
    nullable: true
  })
  @Field({ nullable: true })
  type?: string;

  @Column({
    nullable: true
  })
  @Field({ nullable: true })
  thumbnail?: string;

  @Column({
    type: 'text',
    nullable: true
  })
  @Field({ nullable: true })
  summary?: string;

  @Column({
    nullable: true
  })
  @Field({ nullable: true })
  released?: string;

  @Column({
    nullable: true
  })
  @Field({ nullable: true })
  status?: string;

  @OneToMany(() => Episode, e => e.series, {
    cascade: true
  })
  @Field(() => [Episode])
  episodes: Episode[];

  @ManyToMany(() => Genre, {
    cascade: true
  })
  @JoinTable()
  @Field(() => [Genre])
  genres: Genre[];
}
