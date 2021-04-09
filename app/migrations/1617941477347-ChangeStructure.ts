import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeStructure1617941477347 implements MigrationInterface {
  name = 'ChangeStructure1617941477347';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `series` CHANGE `type` `type` varchar(255) NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` CHANGE `link` `link` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` ADD UNIQUE INDEX `IDX_8aa9d26065e00e74789bc630d8` (`link`)'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` CHANGE `videoId` `videoId` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` ADD UNIQUE INDEX `IDX_5b7cc9bbab217c245bfd937b33` (`videoId`)'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_series` CHANGE `link` `link` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_series` ADD UNIQUE INDEX `IDX_d56fc05d2df5af9932838a10bb` (`link`)'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_series` CHANGE `movieId` `movieId` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_series` ADD UNIQUE INDEX `IDX_97bc6b1738f2c5224b224a081b` (`movieId`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_series` DROP INDEX `IDX_97bc6b1738f2c5224b224a081b`'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_series` CHANGE `movieId` `movieId` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_series` DROP INDEX `IDX_d56fc05d2df5af9932838a10bb`'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_series` CHANGE `link` `link` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` DROP INDEX `IDX_5b7cc9bbab217c245bfd937b33`'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` CHANGE `videoId` `videoId` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` DROP INDEX `IDX_8aa9d26065e00e74789bc630d8`'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` CHANGE `link` `link` varchar(255) NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `series` CHANGE `type` `type` varchar(255) NOT NULL'
    );
  }
}
