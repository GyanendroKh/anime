import { MigrationInterface, QueryRunner } from 'typeorm';

export class Split1616750989847 implements MigrationInterface {
  name = 'Split1616750989847';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP INDEX `IDX_78d6006b7e9c096e819de3fd8e` ON `series`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_b636614387ec0f7eac56bade77` ON `series`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_8531498fcb745ccefc30578a04` ON `episode`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_92bd4c1b76bafee90dee7a9a10` ON `episode`'
    );
    await queryRunner.query('ALTER TABLE `series` DROP COLUMN `link`');
    await queryRunner.query('ALTER TABLE `series` DROP COLUMN `movieId`');
    await queryRunner.query('ALTER TABLE `episode` DROP COLUMN `link`');
    await queryRunner.query('ALTER TABLE `episode` DROP COLUMN `name`');
    await queryRunner.query('ALTER TABLE `episode` DROP COLUMN `videoId`');
    await queryRunner.query(
      'ALTER TABLE `series` ADD `type` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `episode` ADD `title` varchar(255) NOT NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `episode` DROP COLUMN `title`');
    await queryRunner.query('ALTER TABLE `series` DROP COLUMN `type`');
    await queryRunner.query(
      'ALTER TABLE `episode` ADD `videoId` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `episode` ADD `name` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `episode` ADD `link` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `series` ADD `movieId` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `series` ADD `link` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_92bd4c1b76bafee90dee7a9a10` ON `episode` (`link`)'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_8531498fcb745ccefc30578a04` ON `episode` (`videoId`)'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_b636614387ec0f7eac56bade77` ON `series` (`movieId`)'
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `IDX_78d6006b7e9c096e819de3fd8e` ON `series` (`link`)'
    );
  }
}
