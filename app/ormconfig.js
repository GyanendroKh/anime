/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(path.join(path.resolve(), '.env'));

module.exports = {
  type: 'mysql',
  url: process.env.DATABASE_URL,
  entities: ['libs/database/src/entity/**/*.entity.ts'],
  migrationsTableName: 'migrations',
  migrations: ['migrations/*.ts'],
  cli: {
    migrationsDir: 'migrations'
  }
};
