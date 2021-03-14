import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve, join } from 'path';

const addEnv = (path: string) => {
  if (existsSync(path)) {
    console.log(`Loading ${path} ...`);
    config({ path });
  }
};

addEnv(join(resolve(), `.env.${process.env.NODE_ENV}`));
addEnv(join(resolve(), '.env'));
