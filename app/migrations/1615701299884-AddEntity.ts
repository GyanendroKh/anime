import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEntity1615701299884 implements MigrationInterface {
  name = 'AddEntity1615701299884';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `genre` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, UNIQUE INDEX `IDX_3e554b051ddcb121a7e3d946e6` (`uuid`), UNIQUE INDEX `IDX_dd8cd9e50dd049656e4be1f7e8` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `series` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `title` varchar(255) NOT NULL, `link` varchar(255) NOT NULL, `movieId` varchar(255) NOT NULL, `thumbnail` varchar(255) NULL, `summary` text NULL, `released` varchar(255) NULL, `status` varchar(255) NULL, UNIQUE INDEX `IDX_20ac4cee46f30b98e10aa4e6f3` (`uuid`), UNIQUE INDEX `IDX_78d6006b7e9c096e819de3fd8e` (`link`), UNIQUE INDEX `IDX_b636614387ec0f7eac56bade77` (`movieId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `episode` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `number` int NOT NULL, `name` varchar(255) NOT NULL, `link` varchar(255) NOT NULL, `videoId` varchar(255) NOT NULL, `seriesId` int NULL, UNIQUE INDEX `IDX_e77456a16933113be5d0178b2b` (`uuid`), UNIQUE INDEX `IDX_92bd4c1b76bafee90dee7a9a10` (`link`), UNIQUE INDEX `IDX_8531498fcb745ccefc30578a04` (`videoId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `series_genres_genre` (`seriesId` int NOT NULL, `genreId` int NOT NULL, INDEX `IDX_4b1f6c8b46319f1a5b371b7bca` (`seriesId`), INDEX `IDX_a4c3d7fb25f541196055df96ef` (`genreId`), PRIMARY KEY (`seriesId`, `genreId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `episode` ADD CONSTRAINT `FK_6664832a677738a53b1e29a07e7` FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `series_genres_genre` ADD CONSTRAINT `FK_4b1f6c8b46319f1a5b371b7bca8` FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `series_genres_genre` ADD CONSTRAINT `FK_a4c3d7fb25f541196055df96ef2` FOREIGN KEY (`genreId`) REFERENCES `genre`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `series_genres_genre` DROP FOREIGN KEY `FK_a4c3d7fb25f541196055df96ef2`'
    );
    await queryRunner.query(
      'ALTER TABLE `series_genres_genre` DROP FOREIGN KEY `FK_4b1f6c8b46319f1a5b371b7bca8`'
    );
    await queryRunner.query(
      'ALTER TABLE `episode` DROP FOREIGN KEY `FK_6664832a677738a53b1e29a07e7`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_a4c3d7fb25f541196055df96ef` ON `series_genres_genre`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_4b1f6c8b46319f1a5b371b7bca` ON `series_genres_genre`'
    );
    await queryRunner.query('DROP TABLE `series_genres_genre`');
    await queryRunner.query(
      'DROP INDEX `IDX_8531498fcb745ccefc30578a04` ON `episode`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_92bd4c1b76bafee90dee7a9a10` ON `episode`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_e77456a16933113be5d0178b2b` ON `episode`'
    );
    await queryRunner.query('DROP TABLE `episode`');
    await queryRunner.query(
      'DROP INDEX `IDX_b636614387ec0f7eac56bade77` ON `series`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_78d6006b7e9c096e819de3fd8e` ON `series`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_20ac4cee46f30b98e10aa4e6f3` ON `series`'
    );
    await queryRunner.query('DROP TABLE `series`');
    await queryRunner.query(
      'DROP INDEX `IDX_dd8cd9e50dd049656e4be1f7e8` ON `genre`'
    );
    await queryRunner.query(
      'DROP INDEX `IDX_3e554b051ddcb121a7e3d946e6` ON `genre`'
    );
    await queryRunner.query('DROP TABLE `genre`');
  }
}
