import { Field, ObjectType } from '@nestjs/graphql';
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
@ObjectType()
export class GoGoAnimeSeries extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Field({ nullable: true })
  link?: string;

  @Column({ unique: true })
  @Field({ nullable: true })
  movieId?: string;

  @OneToOne(() => Series, {
    cascade: true
  })
  @JoinColumn()
  @Field(() => Series)
  series: Series;
}
