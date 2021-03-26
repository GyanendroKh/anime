import { MigrationInterface, QueryRunner } from 'typeorm';

export class GogoAnime1616751685170 implements MigrationInterface {
  name = 'GogoAnime1616751685170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `go_go_anime_episode` (`id` int NOT NULL AUTO_INCREMENT, `link` varchar(255) NOT NULL, `videoId` varchar(255) NOT NULL, `episodeId` int NULL, UNIQUE INDEX `REL_90de5c8caa1634a7499b8a4af2` (`episodeId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `go_go_anime_series` (`id` int NOT NULL AUTO_INCREMENT, `link` varchar(255) NOT NULL, `movieId` varchar(255) NOT NULL, `seriesId` int NULL, UNIQUE INDEX `REL_63e7003427e5bdf5a7e9d0d6e4` (`seriesId`), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` ADD CONSTRAINT `FK_90de5c8caa1634a7499b8a4af29` FOREIGN KEY (`episodeId`) REFERENCES `episode`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_series` ADD CONSTRAINT `FK_63e7003427e5bdf5a7e9d0d6e4d` FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_series` DROP FOREIGN KEY `FK_63e7003427e5bdf5a7e9d0d6e4d`'
    );
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` DROP FOREIGN KEY `FK_90de5c8caa1634a7499b8a4af29`'
    );
    await queryRunner.query(
      'DROP INDEX `REL_63e7003427e5bdf5a7e9d0d6e4` ON `go_go_anime_series`'
    );
    await queryRunner.query('DROP TABLE `go_go_anime_series`');
    await queryRunner.query(
      'DROP INDEX `REL_90de5c8caa1634a7499b8a4af2` ON `go_go_anime_episode`'
    );
    await queryRunner.query('DROP TABLE `go_go_anime_episode`');
  }
}
