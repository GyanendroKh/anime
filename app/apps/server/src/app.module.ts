import { Module } from '@nestjs/common';
import { TYPEORM_MODULE } from '@app/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeriesModule } from './series/series.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    TYPEORM_MODULE,
    SeriesModule,
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: true
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
