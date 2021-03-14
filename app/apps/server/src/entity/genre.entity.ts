import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Genre extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  @Generated('uuid')
  uuid: string;

  @Column({
    unique: true
  })
  name: string;
}
