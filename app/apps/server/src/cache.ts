import { CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

export const CacheMod = CacheModule.register({
  store: redisStore,
  ttl: 1000
});
