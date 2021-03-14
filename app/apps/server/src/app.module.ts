import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      synchronize: false,
      logging: true,
      entities: []
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
