import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Series } from './series.entity';

@Entity()
@ObjectType()
export class Episode extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  @Generated('uuid')
  @Field()
  uuid: string;

  @Column()
  @Field(() => Int)
  number: number;

  @Column()
  @Field()
  title: string;

  @ManyToOne(() => Series, s => s.episodes)
  @Field(() => Series)
  series: Series;
}
