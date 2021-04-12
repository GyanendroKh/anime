import { MigrationInterface, QueryRunner } from 'typeorm';

export class GoGoAnimeEpisodeVideoIdNull1618205925635
  implements MigrationInterface {
  name = 'GoGoAnimeEpisodeVideoIdNull1618205925635';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` CHANGE `videoId` `videoId` varchar(255) NULL'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `go_go_anime_episode` CHANGE `videoId` `videoId` varchar(255) NOT NULL'
    );
  }
}
