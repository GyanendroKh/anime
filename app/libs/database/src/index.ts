import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entity';

export const TYPEORM_MODULE = TypeOrmModule.forRoot({
  type: 'mysql',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  entities: [...Object.values(entities)]
});

export * from './entity';
export * from './repo';
